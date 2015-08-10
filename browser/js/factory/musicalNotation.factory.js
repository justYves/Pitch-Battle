app.factory('MusicalCanvas', function($rootScope) {
  var ctx;
  var stave;
  var canvas;
  var num_beats = num_beats || 1;
  var beat_value = beat_value || 4;

  function note(randNote) {
    randNote = [].slice.call(randNote);
    this.octave = randNote.pop();
    this.tone = randNote.shift();
    this.sharp = !!randNote.length ? '' : '#';

    var newNote = new Vex.Flow.StaveNote({
      keys: [this.tone + this.sharp + '/' + this.octave],
      duration: "q"
    });
    if (!!randNote.length) newNote.addAccidental(0, new Vex.Flow.Accidental("#"))
    return newNote;
  }

  function init(canvas) {
    var renderer = new Vex.Flow.Renderer(canvas,
      Vex.Flow.Renderer.Backends.CANVAS);
    ctx = renderer.getContext();
    stave = new Vex.Flow.Stave(10, 0, 100);
    stave.addClef("treble").setContext(ctx).draw(); //check treble or bass

  }

  function clear (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  function addNote(randNote) {
      // Create the notes
      var notes = [
        new note(randNote)
      ];
      // Create a voice in 4/4
      var voice = new Vex.Flow.Voice({
        num_beats: 1,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION
      });

      // Add notes to voice
      voice.addTickables(notes);

      // Format and justify the notes to 500 pixels
      var formatter = new Vex.Flow.Formatter().
      joinVoices([voice]).format([voice], 100);

      // Render voice
      voice.draw(ctx, stave);
    }


  return {
    init: init,
    clear: clear,
    addNote: function(canvas,note){
      clear(canvas);
      init(canvas);
      addNote(note);

    }
  };



});