app.controller('FightCtrl', function($log, $location,opponent, user, $scope, $state, MicrophoneSample, MusicalCanvas, mySocket) {
  $scope.opponent = opponent;
  $scope.user = user.getAll();
  var isOver =false;





  //opponent left Redirect to waiting
  mySocket.on('leave',function(){
    mySocket.emit('return to Waiting');
    // var seconds = 5;
    $scope.messageLog = $scope.opponent.name + " disconnected... Redirecting to the Waiting Room. ";
    $scope.seconds=5;
    // setInterval(function(){
    //   $scope.seconds--;
    //   console.log($scope.seconds);
    //   $scope.$digest();
    // },1000);
    setTimeout(function(){
      mySocket.emit('ready',$scope.user.name);
      $state.go('battle.waiting'); //returning to waiting room
    },5000);

  });


//Game Mechanics

  mySocket.on('fight', function(room) {
    $scope.room = room;
    console.log("I'm fighting in room: ", room);
  });

  mySocket.on('new note',function(note){
    $scope.currentNote = note;
    console.log("received note", note);
  });

  //Receive a hit
  mySocket.on('hit',function(){
    Math.min($scope.user.hp-25,0); //To be customized
    // $scope.$digest;
  });

    //Emit a hit to opponents
  $scope.correct = function(){
    mySocket.emit("room",$scope.room,'hit');
    $scope.opponent.hp= Math.min($scope.opponent.hp-25,0); //To be customized
  };

  //If user is leaving the room; Note working. need to add on root State change from to
  $scope.$on('$locationChangeStart', function (scope, next, current) {
    if(!isOver && next.indexOf('waiting')!==-1){
      alert("are you sure you want to leave?");
        mySocket.emit('disconnect');
        mySocket.emit('ready',$scope.user.name);
        console.log('going home');
    }
  });
});

  //$location.url() not working
  // $scope.getlocation= function(){
  //   console.log($location.url());
  //   return $location.url();
  // };