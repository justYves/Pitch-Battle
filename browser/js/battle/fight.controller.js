app.controller('FightCtrl', function($log, $location,opponent, user, $scope, $state, MicrophoneSample, MusicalCanvas, mySocket) {
  $scope.opponent = opponent;
  $scope.user = user.getAll();
  $scope.seconds = 5;
  var isOver =false;

  //Emit a hit to opponents
  $scope.correct = function(){
    mySocket.emit("room",$scope.room,'hit');
    $scope.opponent.hp-= 25; //To be customized
  };

  mySocket.on('fight', function(room) {
    $scope.room = room;
    console.log("I'm fighting in room: ", room);
  });

  //opponent left Redirect to waiting
  mySocket.on('leave',function(){
    mySocket.emit('return to Waiting');
    $scope.messageLog = $scope.opponent.name + " disconnected... Redirecting to the Waiting Room. (" + $scope.seconds + 's)';
        setInterval(function(){
      $scope.seconds = $scope.seconds--;
      $scope.$digest();
    },1000);
    setTimeout(function(){
      mySocket.emit('ready',$scope.user.name);
      $state.go('battle.waiting'); //returning to waiting room
    },5000);

  });


  //Receive a hit
  mySocket.on('hit',function(){
    $scope.user.hp -= 25; //To be customized
    // $scope.$digest;
  });

  //If user is leaving the room;
  $scope.$on('$locationChangeStart', function (scope, next, current) {
    if(!isOver){
      console.log(scope,next,current); //Need to disconnect from room
      // $state.go('home');
    }
  });
});