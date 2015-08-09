app.controller('BattleCtrl', function($log, $scope, $state, user, mySocket, opponent) {
  $scope.nickName = user.getName();
  $scope.messageLog = 'is Ready to  Pitch battle!';
  $scope.opponent = opponent;

  $scope.logOut = function() {
      mySocket.disconnect();
      $state.go('home');
  };

  $scope.replay = function() {
    $state.go('battle.waiting'); //returning to waiting room
  };

  //Make the user ready to battle
  mySocket.on('connect', function() {
    mySocket.emit('ready', $scope.nickName, $scope.messageLog);
  });

  //register the player ID
  mySocket.on('connection successfull', function(id) {
    console.log("i'm connected as ", id);
    $scope.socketID = id;
  });

  $scope.win = function() {

  };

  $scope.lose = function() {

  };
  mySocket.on('foundOpponents', function(player) {
    $scope.opponent = opponent;
    $scope.opponent.name = player;
    console.log("your opponent is ", opponent.name);
    $state.go('battle.fight');
  });

});