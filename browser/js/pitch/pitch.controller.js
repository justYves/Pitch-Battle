app.controller('PitchCtrl', function($rootScope, $scope, $http, practiceMicrophone,MusicalCanvas) {
  // var MAX_SIZE = Math.max(4, Math.floor($rootScope.audioContext.sampleRate / 5000));

  //creates voice audio and display

  var audioContext = new window.AudioContext;

  var sharp = $scope.sharp = false; //Beginner // Difficult -> Move to factory

  //Create
  var canvas = $("#musical-note")[0];
  MusicalCanvas.init(canvas);

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
// console.log("used Range:",noteRange);

var randNote;
var synth = new Tone.SimpleSynth().toMaster();

//Happens to fast
setTimeout(function(){
var voice = new practiceMicrophone(audioContext);

$scope.giveNote = function() {
    randNote = noteRange[Math.floor(Math.random()*(noteRange.length))];
    // console.log(randNote);
    MusicalCanvas.addNote(canvas,randNote);
    //create one of Tone's built-in synthesizers and connect it to the master output
    //play a middle c for the duration of an 8th note
    $scope.play(randNote);
    voice.listen(randNote);
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
        $scope.randNoteFreq = Math.round(synth.noteToFrequency(note));
        synth.triggerAttackRelease(note, "8n");
      };

  $scope.pause = voice.pause;



// <----- End of factory ----->

},500)

});