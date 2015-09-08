app.controller('BattleCtrl', function($log, $scope, $state, user, mySocket, opponent, MicrophoneSample) {
    // $scope.pic = user.getPic();
    // console.log($scope.pic);


    //1. Create the audio context before going to battle in order to avoid the lag
    var audioContext = new window.AudioContext;
    $scope.voice = new MicrophoneSample(audioContext);
    $scope.voice.getMicrophoneInput(ready); //Call the ready function when it's triggered
    $scope.nickName = user.getName();
    $scope.pic = user.getPic();
    $scope.messageLog = 'is Ready to  Pitch battle!';
    $scope.opponent = opponent;


    $scope.logOut = function() {
        mySocket.disconnect();
        $state.go('home');
    };

    $scope.replay = function() {
        $state.go('battle.waiting'); //returning to waiting room
    };

    //Make the user ready to battle function declaration
    function ready(stream) {
        $scope.voice.stream = stream;
        $scope.$digest;
        console.log(user.getName() + "is ready and in the Waiting Room (battle Controller");
        mySocket.emit('ready', user.getName(),sendImage(user.getPic())); //User get name is working //image now working

    }

    function sendImage(pic) {
        var JSONimg = {
            'type': 'img',
            'data': pic,
        };
        return JSON.stringify(JSONimg);
    }

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
        // console.log("received data", img)
        // $scope.opponent.img = img;
        console.log("your opponent is ", opponent.name);
        $state.go('battle.fight');
    });
});