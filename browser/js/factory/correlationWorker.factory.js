app.factory('CorrelationWork', function(pitch, $log) {
    var blobURL = URL.createObjectURL(new Blob(['(',
        function() {
            //Long-running work here
            self.onmessage = function(event)
            {
                var timeseries = event.data.timeseries;
                var testFrequencies = event.data.testFrequencies;
                var sampleRate = event.data.sampleRate;
                var amplitudes = compute_correlations(timeseries, testFrequencies, sampleRate);
                self.postMessage({
                    "timeseries": timeseries,
                    "frequencyAmplitudes": amplitudes
                });
            };

            function compute_correlations(timeseries, testFrequencies, sampleRate) {
                // 2pi * frequency gives the appropriate period to sine.
                // timeseries index / sampleRate gives the appropriate time coordinate.
                //
                var scale_factor = 2 * Math.PI / sampleRate;
                var amplitudes = testFrequencies.map(
                    function(f) {
                        // console.log("called");
                        var frequency = f.frequency;
                        // console.log("frequency",frequency);
                        // Represent a complex number as a length-2 array [ real, imaginary ].
                        var accumulator = [0, 0];
                        for (var t = 0; t < timeseries.length; t++) {
                            accumulator[0] += timeseries[t] * Math.cos(scale_factor * frequency * t);
                            accumulator[1] += timeseries[t] * Math.sin(scale_factor * frequency * t);
                        }

                        return accumulator;
                    }
                );
                // console.log("amplitude",amplitudes)
                return amplitudes;
            }
        }.toString(),

        ')()'
    ], {
        type: 'application/javascript'
    }));
return blobURL;

});
