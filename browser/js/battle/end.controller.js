app.controller('EndCtrl', function($log, $scope, $state, user, mySocket, opponent, game) {
    // $scope.pic = user.getPic();
    // console.log($scope.pic);
    console.log("End Ctrl ran");

    $scope.won = game.won;
    $scope.logOut = function() {
        mySocket.disconnect();
        $state.go('home');
    };

    $scope.replay = function() {
        $state.go('battle.waiting'); //returning to waiting room
    };

});