app.factory('MicrophoneSample',function($rootScope){
  var audioContext;
  function MicrophoneSample(context) {
    audioContext=context;
    this.WIDTH = 640;
    this.HEIGHT = 480;
    this.getMicrophoneInput();
    this.canvas = $('#voice')[0];
  }

  MicrophoneSample.prototype.getMicrophoneInput = function() {
    navigator.getUserMedia({
        audio: true
      },
      this.onStream.bind(this),
      this.onStreamError.bind(this));
  };


  MicrophoneSample.prototype.onStream = function(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    var filter = audioContext.createBiquadFilter();
    // filter.frequency.value = 60.0;
    // filter.type = filter.NOTCH;
    // filter.Q = 10.0;

    var analyser = audioContext.createAnalyser();

    // Connect graph.
    input.connect(filter);
    filter.connect(analyser);

    this.analyser = analyser;
    // Setup a timer to visualize some stuff.
    window.requestAnimationFrame(this.visualize.bind(this));
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