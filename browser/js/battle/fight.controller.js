app.controller('FightCtrl', function($log, $location,opponent, user, $scope, $state, MicrophoneSample, MusicalCanvas, mySocket) {
  $scope.opponent = opponent;
  $scope.user = user.getAll();

  //Emit a hit to opponents
  $scope.correct = function(){
    mySocket.emit("room",$scope.room,'hit');
    $scope.opponent.hp-= 25; //To be customized
  };

  mySocket.on('fight', function(room) {
    $scope.room = room;
    console.log("I'm fighting in room: ", room);
  });


  //Receive a hit
  mySocket.on('hit',function(){
    $scope.user.hp -= 25; //To be customized
    // $scope.$digest;
  });

  //If user is leaving the room;
  $scope.$on('$locationChangeStart', function (scope, next, current) {

    // $state.go('home');
    console.log(scope,next,current); //Need to disconnect from room
  });
});