app.controller('PitchCtrl', function($rootScope, $scope, $http, practiceMicrophone, MusicalCanvas, Widget) {

  //creates voice audio and display
  var audioContext = new window.AudioContext;
  var sharp = $scope.sharp = false; //Beginner // Difficult -> Move to factory
  var canvas = $("#musical-note")[0];


  // <----- Need to move to factory ----->
  //Note Generator
  var keys = [4, 5];
  var notes = (sharp) ? ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] : ["C", "D", "E", "F", "G", "A", "B"];
  var noteRange = [];

  keys.forEach(function(key) {
    notes.forEach(function(note) {
      noteRange.push(note + key);
    });
  });

  var randNote;
  var synth = new Tone.SimpleSynth().toMaster();

  //Happens too fast
  setTimeout(function() {
      var voice = new practiceMicrophone(audioContext);


      $scope.giveNote = function() {
      voice.clearWidget();
      MusicalCanvas.init(canvas);
        randNote = noteRange[Math.floor(Math.random() * (noteRange.length))];
        // console.log(randNote);

        MusicalCanvas.addNote(canvas, randNote);
        //create one of Tone's built-in synthesizers and connect it to the master output
        //play a middle c for the duration of an 8th note

        $scope.play(randNote);
        $scope.started= true;
        setTimeout(function() {
          voice.listen(randNote);
          $scope.reset=false;
        }, 1000);
    };

    $scope.repeatNote = function() {
      if (!randNote) return;
      voice.silence(1000);
      $scope.play(randNote);
    };

    $scope.playNext = function() {
      voice.pause();
      voice.clearWidget();
      var pos = noteRange.indexOf(randNote);
      if (pos !== -1) {
        randNote = (noteRange[pos + 1] || noteRange[0]);
        MusicalCanvas.addNote(canvas, randNote);
        $scope.play(randNote);
        setTimeout(function() {
          voice.listen(randNote);
          $scope.reset=false;
        }, 1000);
      }
    }; $scope.playPrev = function() {
      voice.pause();
      voice.clearWidget();
      var pos = noteRange.indexOf(randNote);
      if (pos !== -1) {
        randNote = (noteRange[pos - 1] || noteRange[noteRange.length - 1]);
        MusicalCanvas.addNote(canvas, randNote);
                $scope.play(randNote);
        setTimeout(function() {
          voice.listen(randNote);
          $scope.reset=false;
        }, 1000);
      }
    };

    $scope.play = function(note) {
      $scope.randNote = note;
      $scope.randNoteFreq = Math.round(synth.noteToFrequency(note));
      synth.triggerAttackRelease(note, "8n");
    };

    $scope.pause = function(){
      voice.pause();
    };
  }, 500);
// <----- End of factory ----->


});