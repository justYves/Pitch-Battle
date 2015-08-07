app.factory('MusicalCanvas', function($rootScope) {
    var ctx;
    var stave;
    return {
        init: function(canvas) {
            var renderer = new Vex.Flow.Renderer(canvas,
                Vex.Flow.Renderer.Backends.CANVAS);
            ctx = renderer.getContext();
            stave = new Vex.Flow.Stave(10, 0, 500);
            stave.addClef("treble").setContext(ctx).draw();
        },

        addNote: function(note) {
            // Create the notes
            var notes = [
                // A quarter-note C.
                new Vex.Flow.StaveNote({
                    keys: ["C#/4"],
                    duration: "q"
                })
                .addAccidental(0, new Vex.Flow.Accidental("#"))
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
            joinVoices([voice]).format([voice], 500);

            // Render voice
            voice.draw(ctx, stave);
        }
    };





});
