app.factory('MicrophoneSample', function(pitch, $log, CorrelationWork) {
    var audioContext;
    var gainNode;
    var scriptProcessor;
    var correlationWorker;

    function MicrophoneSample(context) {
        audioContext = context;
        this.WIDTH = 640;
        this.HEIGHT = 480;
        this.getMicrophoneInput();
        this.canvas = $('#voice')[0];
        //<---- Solution 1---->
        // this.sungNote =$('#note');
        // this.sungCents = $('#cents');
    };

    MicrophoneSample.prototype.getMicrophoneInput = function() {
        navigator.getUserMedia({
                audio: true
            },
            this.onStream.bind(this),
            this.onStreamError.bind(this));
    };

    MicrophoneSample.prototype.listen = function() {
        gainNode.gain.value = 1;
        this.analysePitch();
    };

    MicrophoneSample.prototype.pause = function() {
        gainNode.gain.value = 0;
        correlationWorker.terminate();
        scriptProcessor.onaudioprocess={};
    };



    MicrophoneSample.prototype.onStream = function(stream) {
        var input = audioContext.createMediaStreamSource(stream); //<- convert it to a stream source
        var filter = audioContext.createBiquadFilter();
        // filter.frequency.value = 60.0;
        // filter.type = filter.NOTCH;
        // filter.Q = 10.0;

        // <---- This is for the graph--->
        var analyser = audioContext.createAnalyser();
        this.analyser = analyser;

        //<--- This control the volume --->
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0;

        //second analyser <--- this is for the pitch --->
        var analyserAudioNode = audioContext.createAnalyser();
        this.analyserAudioNode = analyserAudioNode;
        // analyserAudioNode.fftSize = 2048;
        // this.detectPitch.bind(this)();

        // Connect graph.
        input.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(analyserAudioNode);
        analyserAudioNode.connect(analyser);
        /// <--- Solution 2 --->
        // Setup a timer to visualize some stuff.
        window.requestAnimationFrame(this.visualize.bind(this));
    };


    /// <---- Solution 2--->
    MicrophoneSample.prototype.analysePitch = function() {
        var C2 = 65.41; // C2 note, in Hz.
        var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        var testFrequencies = [];
        var octave = 2;
        for (var i = 0; i < 30; i++) {
            if (!i % 12) octave++;
            var noteFrequency = C2 * Math.pow(2, i / 12);
            var noteName = notes[i % 12];
            var note = {
                "frequency": noteFrequency,
                "name": noteName + octave
            };
            var just_above = {
                "frequency": noteFrequency * Math.pow(2, 1 / 48),
                "name": noteName + octave + " (a bit sharp)"
            };
            var just_below = {
                "frequency": noteFrequency * Math.pow(2, -1 / 48),
                "name": noteName + octave + " (a bit flat)"
            };
            testFrequencies = testFrequencies.concat([just_below, note, just_above]);
        }
        correlationWorker = new Worker(CorrelationWork); //Will run on the user CPUs

        correlationWorker.addEventListener("message", interpretCorrelationResult);

        scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
        // console.log(scriptProcessor);
        this.analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        var buffer = [];
        var sample_length_milliseconds = 100;
        var recording = true;

        //listen to event;
        // var i =0;
        scriptProcessor.onaudioprocess = function(event) {
        // console.log("called",i++)
            if (!recording) return;
            buffer = buffer.concat(Array.prototype.slice.call(event.inputBuffer.getChannelData(0)));
            if (buffer.length > sample_length_milliseconds * audioContext.sampleRate / 1000) {
                recording = false;
                correlationWorker.postMessage({
                    "timeseries": buffer,
                    "testFrequencies": testFrequencies,
                    "sampleRate": audioContext.sampleRate
                });
                buffer = [];
                setTimeout(function() {
                    recording = true;
                }, 250);
            }
        };

        function interpretCorrelationResult(event) {
            var timeseries = event.data.timeseries;
            // console.log(timeseries);
            var frequencyAmplitudes = event.data.frequencyAmplitudes;
            // Compute the (squared) magnitudes of the complex amplitudes for each
            // test frequency.
            var magnitudes = frequencyAmplitudes.map(function(z) {
                return z[0] * z[0] + z[1] * z[1];
            });
            // Find the maximum in the list of magnitudes.
            var maximum_index = -1;
            var maximum_magnitude = 0;
            for (var i = 0; i < magnitudes.length; i++) {
                if (magnitudes[i] <= maximum_magnitude)
                    continue;
                maximum_index = i;
                maximum_magnitude = magnitudes[i];
            }
            // Compute the average magnitude. We'll only pay attention to frequencies
            // with magnitudes significantly above average.
            var average = magnitudes.reduce(function(a, b) {
                return a + b;
            }, 0) / magnitudes.length;
            var confidence = maximum_magnitude / average;
            var confidenceThreshold = 10; // empirical, arbitrary.
            // console.log(confidence);
            if (confidence > confidenceThreshold) {
                var dominantFrequency = testFrequencies[maximum_index];
                console.log(average, dominantFrequency.name, frequency);
                document.getElementById("note-name").textContent = dominantFrequency.name;
                document.getElementById("frequency").textContent = dominantFrequency.frequency;
            }
        }
    };


    MicrophoneSample.prototype.onStreamError = function(e) {
        console.error('Error getting microphone', e);
    };

    MicrophoneSample.prototype.visualize = function() {
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        var drawContext = this.canvas.getContext('2d');

        var times = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(times);
        for (var i = 0; i < times.length; i++) {
            var value = times[i];
            var percent = value / 256;
            var height = this.HEIGHT * percent;
            var offset = this.HEIGHT - height - 1;
            var barWidth = this.WIDTH / times.length;
            drawContext.fillStyle = 'black';
            drawContext.fillRect(i * barWidth, offset, 1, 1);
        }
        window.requestAnimationFrame(this.visualize.bind(this));
    };

    // <---- Solution 1 ---->
    MicrophoneSample.prototype.detectPitch = function() {
        var analyserAudioNode = this.analyserAudioNode;
        var buffer = new Uint8Array(analyserAudioNode.fftSize);
        analyserAudioNode.getByteTimeDomainData(buffer);
        var fundamentalFreq = pitch.findFundamentalFreq(buffer, audioContext.sampleRate);
        console.log(fundamentalFreq);
        if (fundamentalFreq !== -1) {
            var note = pitch.findClosestNote(fundamentalFreq);
            console.log(note);
            // var cents = findCentsOffPitch(fundamentalFreq, note.frequency);
            this.updateNote(note.note);
            // this.updateCents(cents);
        } else {
            this.updateNote('--');
            this.updateCents(-50);
        }

        window.requestAnimationFrame(this.detectPitch.bind(this));
    };

    MicrophoneSample.prototype.updateNote = function(note) {
        // console.log(this.sungNote);
        this.sungNote.text(note);
    };

    MicrophoneSample.prototype.updateCents = function(cents) {
        // console.log(this.Cents);
        this.sungCents.text(cents)
    };

    // <---- Solution 1 ---->


    return MicrophoneSample;
});
