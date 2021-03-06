app.factory('MicrophoneSample', function($log, CorrelationWork, Widget,mySocket,$rootScope) {
    var audioContext;
    var gainNode;
    var scriptProcessor;
    var correlationWorker;
    var analyzedTones = [];
    var noteToMatch;
    var progressBar = 0;

    function MicrophoneSample(context) {
        audioContext = context;
        // console.log(audioContext);
        this.WIDTH = 640;
        this.HEIGHT = 480;
        this.getMicrophoneInput;
        this.canvas;
        // $('#voice')[0];
        this.isListening = false;
        this.startTime;
        this.stopTime;
        this.stream;

        //<---- Solution 1---->
        // this.sungNote =$('#note');
        // this.sungCents = $('#cents');
    };

    MicrophoneSample.prototype.createWidget = function(){
        // console.log("widgetCreated");
        this.widgetCanvas = $("#widget")[0];
        this.widget = new Widget(this.widgetCanvas, '#ffffff', '#2c3e50', '#F7D708', '#2c3e50', '#18bc9c');
        this.widget.show("", "", "", "");
    };

    MicrophoneSample.prototype.getMicrophoneInput = function(callback) {
        navigator.getUserMedia({
                audio: true
            },
            callback.bind(this),
            this.onStreamError.bind(this));
    };

    MicrophoneSample.prototype.listen = function(note) {
        analyzedTones = [];
        progressBar = 0;
        noteToMatch = note.slice(0, -1);
        this.startTime = audioContext.currentTime;
        gainNode.gain.value = 1;
        this.isListening = true;
        this.analysePitch();
    };

    MicrophoneSample.prototype.pause = function() {
        this.widget.show("", "", "", "");
        this.isListening = false;
        console.log("tomatch", noteToMatch);
        console.log("analyzed Tones", analyzedTones);
        console.log("time:", audioContext.currentTime - this.startTime + ' seconds.');
        gainNode.gain.value = 0;
        correlationWorker.terminate();
        scriptProcessor.onaudioprocess = {};
    };



    MicrophoneSample.prototype.onStream = function() {
        var input = audioContext.createMediaStreamSource(this.stream); //<- convert it to a stream source
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
            "name": noteName
        };
        var just_above = {
            "frequency": noteFrequency * Math.pow(2, 1 / 48),
            "name": noteName + " (a bit sharp)"
        };
        var just_below = {
            "frequency": noteFrequency * Math.pow(2, -1 / 48),
            "name": noteName + " (a bit flat)"
        };
        testFrequencies = testFrequencies.concat([just_below, note, just_above]);
    }
    MicrophoneSample.prototype.analysePitch = function() {
        correlationWorker = new Worker(CorrelationWork); //Will run on the user CPUs

        correlationWorker.addEventListener("message", interpretCorrelationResult.bind(this));

        scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
        // console.log(scriptProcessor);
        this.analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        var buffer = [];
        var sampleLengthMilliseconds = 100;
        var recording = true;

        //listen to event;
        // var i =0;
        scriptProcessor.onaudioprocess = function(event) {
            // console.log("called",i++)
            if (!recording) return;
            buffer = buffer.concat(Array.prototype.slice.call(event.inputBuffer.getChannelData(0)));
            if (buffer.length > sampleLengthMilliseconds * audioContext.sampleRate / 1000) {
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
                // console.log(average, dominantFrequency.name, frequency);
                // document.getElementById("frequency").textContent = dominantFrequency.frequency;
            if (!document.getElementById("widget")) {
                    this.pause();
                    return;
                }
                //Not needed anymore
                // document.getElementById("note-name").textContent = dominantFrequency.name;
                var sungNote = dominantFrequency.name.slice(0, 2).trim();
                var info = dominantFrequency.name.slice(2).trim();
                var frequency = Math.round(dominantFrequency.frequency, -2) + ' Hz';


                analyzedTones.push(sungNote);
                //First note equal start bar add 1;
                //if last note equal then ++;
                var difficulty = 7;
                if (sungNote === noteToMatch) {
                    progressBar++;
                } else {
                    progressBar = 0;
                }
                this.widget.show(sungNote, info, frequency, progressBar / difficulty);
                if (progressBar === difficulty) {
                    $rootScope.$broadcast('correct');
                    this.pause();
                }

                //update the widget
                // console.log(progressBar / difficulty);

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
            drawContext.fillStyle = '#2c3e50';
            drawContext.fillRect(i * barWidth, offset, 1, 1);
        }
        window.requestAnimationFrame(this.visualize.bind(this));
    };

    return MicrophoneSample;
});