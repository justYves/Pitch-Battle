app.factory('MicrophoneSample', function(pitch,$log) {
  var audioContext;

  function MicrophoneSample(context) {
    audioContext = context;
    this.WIDTH = 640;
    this.HEIGHT = 480;
    this.getMicrophoneInput();
    this.canvas = $('#voice')[0];
    this.sungNote =$('#note');
    this.sungCents = $('#cents');
  };

  MicrophoneSample.prototype.getMicrophoneInput = function() {
    navigator.getUserMedia({
        audio: true
      },
      this.onStream.bind(this),
      this.onStreamError.bind(this));
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

    //second analyser <--- this is for the pitch --->
    var analyserAudioNode = audioContext.createAnalyser();
    this.analyserAudioNode = analyserAudioNode;
    analyserAudioNode.fftSize = 2048;
    this.detectPitch.bind(this)();

    // Connect graph.
    input.connect(filter);
    filter.connect(analyserAudioNode);
    analyserAudioNode.connect(analyser);

    var script_processor = audioContext.createScriptProcessor(1024, 1, 1);


    // Setup a timer to visualize some stuff.
    window.requestAnimationFrame(this.visualize.bind(this));
  };

  MicrophoneSample.prototype.detectPitch = function() {
    var analyserAudioNode = this.analyserAudioNode;
    var buffer = new Uint8Array(analyserAudioNode.fftSize);
    analyserAudioNode.getByteTimeDomainData(buffer);
    var fundalmentalFreq = pitch.findFundamentalFreq(buffer, audioContext.sampleRate);
    console.log(fundalmentalFreq);
    if (fundalmentalFreq !== -1) {
      var note = findClosestNote(fundalmentalFreq, notesArray);
      var cents = findCentsOffPitch(fundalmentalFreq, note.frequency);
      updateNote(note.note);
      updateCents(cents);
    } else {
      this.updateNote.bind(this)('--');
      // updateCents(-50);
    }

    window.requestAnimationFrame(this.detectPitch.bind(this));
  };

  MicrophoneSample.prototype.updateNote = function(note){
    // console.log(this.sungNote);
    this.sungNote.text(note);
  };

  MicrophoneSample.prototype.updateCents = function(cents){
        $('#cents').text(cents)
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



  return MicrophoneSample;
});