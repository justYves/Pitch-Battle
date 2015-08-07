app.controller('PitchCtrl', function($rootScope, $scope, $http, MicrophoneSample,MusicalCanvas) {
  var audioContext = new window.AudioContext;
  var MAX_SIZE = Math.max(4, Math.floor(audioContext.sampleRate / 5000));

  var voice = new MicrophoneSample(audioContext);

  var buflen = 1024;
  var buf = new Float32Array(buflen);


//Note Generator
var note = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var randNote;
var synth = new Tone.SimpleSynth().toMaster();
  $scope.giveNote = function() {
    randNote = note[Math.floor(Math.random()*(note.length))]+'4';
    console.log(randNote);
    //create one of Tone's built-in synthesizers and connect it to the master output
    //play a middle c for the duration of an 8th note
    $scope.play(randNote);
  };

  $scope.repeatNote =function(){
    if(!randNote) return;
        $scope.play(randNote);
  };

  $scope.playNext = function(){
    var pos = note.indexOf(randNote.slice(0,-1));
    if(pos !== -1){
      randNote= (note[pos+1]||note[0])+'4';
          $scope.play(randNote);
    }
  };
  $scope.playPrev = function(){
    var pos = note.indexOf(randNote.slice(0,-1));
    if(pos !== -1){
      randNote= (note[pos-1]||note[note.length-1])+'4';
          $scope.play(randNote);
    }
  };

  $scope.play = function(note){
        $scope.randNote = note;
        synth.triggerAttackRelease(note, "8n");
      };

//Create
  var canvas = $("#musical-note")[0];
  MusicalCanvas.init(canvas);
  MusicalCanvas.addNote(note);
  MusicalCanvas.addNote(note);
  MusicalCanvas.addNote(note);
});