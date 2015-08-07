app.controller('PitchCtrl', function($rootScope, $scope, $http, MicrophoneSample,MusicalCanvas) {
  var audioContext = new window.AudioContext;
  var MAX_SIZE = Math.max(4, Math.floor(audioContext.sampleRate / 5000));

  //creates voice audio and display
  var voice = new MicrophoneSample(audioContext);

  var buflen = 1024;
  var buf = new Float32Array(buflen);
  var sharp = false;

// <----- Need to move to factory ----->
//Note Generator
var keys  = [4,5];
var notes = (sharp) ?  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]:["C", "D", "E", "F", "G", "A", "B"];
var noteRange=[];

keys.forEach(function(key){
  notes.forEach(function(note){
    noteRange.push(note+key);
  });
});
console.log(noteRange);

var randNote;
var synth = new Tone.SimpleSynth().toMaster();

$scope.giveNote = function() {
    randNote = noteRange[Math.floor(Math.random()*(noteRange.length))];
    console.log(randNote);
    MusicalCanvas.addNote(canvas,randNote);
    //create one of Tone's built-in synthesizers and connect it to the master output
    //play a middle c for the duration of an 8th note
    $scope.play(randNote);
  };

  $scope.repeatNote =function(){
    if(!randNote) return;
        $scope.play(randNote);
  };

  $scope.playNext = function(){
    var pos = noteRange.indexOf(randNote);
    if(pos !== -1){
      randNote= (noteRange[pos+1]||noteRange[0]);
          $scope.play(randNote);
          MusicalCanvas.addNote(canvas,randNote);
    }
  };
  $scope.playPrev = function(){
    var pos = noteRange.indexOf(randNote);
    if(pos !== -1){
      randNote= (noteRange[pos-1]||noteRange[noteRange.length-1]);
          $scope.play(randNote);
          MusicalCanvas.addNote(canvas,randNote);
    }
  };

  $scope.play = function(note){
        $scope.randNote = note;
        synth.triggerAttackRelease(note, "8n");
      };

//Create
  var canvas = $("#musical-note")[0];
  MusicalCanvas.init(canvas);

// <----- End of factory ----->

});