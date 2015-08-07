app.controller('MainCtrl', function($scope,$http) {
// var context = new window.AudioContext();

// $scope.playSong =function(){
//   var song = new Song();
//   console.log(song);
//   song.play;


//     $http.get('public/sounds/4Minute-Crazy.m4a')
//     .then(function(res){
//       console.log(res)
//     })
//     .then(null,console.log);

// };

// function Song() {
//   this.audio = new Audio();
//   //Connect filter
//   // this.filter = context.createBiquadFilter();
//   // this.filter.type = this.filter.LOWPASS;
//   // this.filter.frequency.value = 500;
//   // this.source.connect(this.filter);
//   this.source = context.createMediaElementSource(this.audio);
//   this.source.connect(context.destination);
// }

// Song.prototype.play = function(){
//   this.audio.src = '../../assets/sounds/4Minute-Crazy.m4a';
//   this.audio.play();
// };

  // So sorry. There's no way to detect whether a browser can play multiple audio elements at once.

  // (function init() {
  //   if (!window.AudioContext) {
  //     // bag it and go home
  //     $scope.error = true;
  //     return;
  //   }

  //   setTrackWidth();
  //   initAudio();
  // })();



  // $scope.playTracks = function(tracks) {
  //   if (!tracks) {
  //     tracks = $scope.currentSong.tracks;
  //   }
  //   angular.forEach(tracks, function(track, key) {
  //     track.play();
  //   });
  //   $scope.playing = true;
  // };

  // $scope.stopTracks = function(tracks) {
  //   if (!tracks) {
  //     tracks = $scope.currentSong.tracks;
  //   }
  //   angular.forEach(tracks, function(track, key) {
  //     track.stop();
  //   });
  //   $scope.playing = false;
  // };

  // $scope.$watch('currentSong', function(currentSong, oldSong) {
  //   if ($scope.playing) {
  //     $scope.stopTracks(oldSong.tracks);
  //   }
  //   if (oldSong) {
  //     clearAudios(oldSong.tracks);
  //     $scope.ready = false
  //     thisLoadCount = 0;
  //   }
  // });

  // $scope.trackLoad = function(key, track) {
  //   if (++thisLoadCount >= $scope.currentSong.tracks.length) {
  //     $scope.ready = true;
  //     $scope.$$phase || $scope.$apply();
  //     tick();
  //   }
// }

  // function tick() {
  //   angular.forEach($scope.currentSong.tracks, function(track, key) {
  //     if (track.draw) {
  //       track.draw();
  //     }
  //   });

  //   window.requestAnimationFrame(tick);
  // }


  // function clearAudios(tracks) {
  //   angular.forEach(tracks, function(track, key) {
  //     track.clear();
  //   });
  // }


  // function initAudio() {
  //   $scope.aCtx = new window.AudioContext();
  //   $scope.aCtx.createGain = $scope.aCtx.createGain || $scope.aCtx.createGainNode;
  //   $scope.master.gainNode = $scope.aCtx.createGain();
  //   $scope.master.gainNode.connect($scope.aCtx.destination);

  //   if (!$scope.aCtx.createMediaElementSource || isiOS) {
  //     $scope.useAudioTag = false;
  //   }
  // }


  // function setTrackWidth() {
  //   $scope.trackWidth = document.querySelector('.track-container').offsetWidth;

  //   if ($scope.trackWidth > 1200) {
  //     $scope.trackWidth /= 3;
  //   } else if ($scope.trackWidth > 800) {
  //     $scope.trackWidth /= 2;
  //   }
  //   $scope.trackWidth -= 22;
  // }


});