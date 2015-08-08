app.controller('FightCtrl', function($log, opponent, user, $scope, $state, MicrophoneSample, MusicalCanvas, mySocket) {
  $scope.opponent = opponent;
  $scope.user = user.getAll();

  mySocket.on('fight', function(room) {
    $scope.room = room;
    console.log("I'm fighting in room: ", room);
  });


  //Emit a hit to opponents
  $scope.correct = function(){
    mySocket.emit("room",$scope.room,'hit');
    $scope.opponent.hp-= 25; //To be customized
  };

  //Receive a hit
  mySocket.on('hit',function(){
    $scope.user.hp -= 25; //To be customized
    // $scope.$digest;
  });
});