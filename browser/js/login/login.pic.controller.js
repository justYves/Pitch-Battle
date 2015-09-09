app.controller('loginPicCtrl', function($scope, user, $state) {
  $scope.nickName = user.getName();

  //Create context for
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
    navigator.getUserMedia(videoObj, function(stream) {
      source = window.URL.createObjectURL(stream);
      video.src = source;
      video.play();
    }, errBack);
  };


  $scope.snap = function() {
    console.log(user.getName() + " is taking a pic in the user Controller"); //user.getName is working;
    $scope.clicked2=false;
    context.drawImage(video, 80, 0, 480, 480, 0, 0, 240, 240);
    // context.drawImage(video, 0, 0, 640, 480, 0, 0, 320, 240);
    // context.drawImage(video, 0, 0, 320, 240); // Dim is 240X240?
    video.pause();
    video.src="";
    convertPic();
  };

  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL(); // save as data URL
    console.log("The pic I took was converted to Data URL",image.src);
    console.log("Here is the JSON: ",JSON.stringify(image.src));
  return image.src;
}

function convertPic(){
  user.setPic(convertCanvasToImage(canvas));
  console.log("converting the image and saving it on user", user.getPic()); //User.getPic working Here
}
});