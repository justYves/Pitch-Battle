app.controller('loginPicCtrl', function($scope, user, $state) {
  $scope.nickName = user.getName();
  // var canvas;
  // var context;
  // var video;
  // var videoObj;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var video = document.getElementById("video");
  var source='';
  var videoObj = {
    "video": true
  };

  function errBack(error) {
    console.log("Video capture error: ", error.code);
  }

  //Take pics
  $scope.takePic = function() {
    console.log("take pic");
    navigator.getUserMedia(videoObj, function(stream) {
      source = window.URL.createObjectURL(stream);
      video.src = source;
      video.play();
    }, errBack);
  };


  $scope.snap = function() {
    $scope.clicked2=false;
    context.drawImage(video, 0, 0, 160, 160);
    video.pause();
    video.src="";
  };

  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL(); // save as data URL
    console.log("image",image.src);
  return image;
}

$scope.convertPic = function(){
  user.setPic(convertCanvasToImage(canvas));
};


});

// navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
//     var video = document.querySelector('video');
//     video.src = window.URL.createObjectURL(localMediaStream);

//     // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
//     // See crbug.com/110938.
//     video.onloadedmetadata = function(e) {
//       // Ready to go. Do some stuff.
//     };
//   }, errorCallback);