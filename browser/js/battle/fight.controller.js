app.controller('FightCtrl', function($log, $location, opponent, user, $scope, $state, MicrophoneSample, MusicalCanvas, mySocket, $rootScope,game) {

  game.won =false;
  //load pic
  loadCanvas(user.getPic(), 'profilePic');
  console.log("loading pic", opponent.img)
  console.log(document.getElementById("opponentPic"));
  loadCanvas(JSON.parse(opponent.img).data, 'opponentPic');


  function loadCanvas(dataURL, elem) {
    var canvas = document.getElementById(elem);
    var context = canvas.getContext('2d');

    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0);
    };

    imageObj.src = dataURL;
  }

  $scope.opponent = opponent;
  $scope.round = 1;
  $scope.opponent.hp = 100; //set health
  user.restart(); //set health
  console.log("this is run at the beg of flight Ctrl, user: ", user.getAll()); //Working
  $scope.user = user.getAll();
  $scope.currentNote = '';
  var isOver = false;
  var voice = $scope.voice;
  voice.createWidget(); //Create Widget;
  voice.onStream(); //open the audio context



  //Create Music canvas
  var canvas = $("#musical-note")[0];
  voice.canvas = $('#voice')[0];
  MusicalCanvas.init(canvas);

  //Create new audio context <- maybe move to parent controller?
  // var audioContext = new window.AudioContext;
  // var voice = new MicrophoneSample(audioContext);
  // console.log("will this run?");
  mySocket.emit("room", $scope.room, 'ready');

  //Need to send a ready emit first ->then fight
  mySocket.on("fight", function(room) {
    $scope.room = room;
    console.log("the new room is", $scope.room)
  })

  //opponent left Redirect to waiting
  mySocket.on('leave', function() {
    mySocket.emit('return to Waiting');
    // var seconds = 5;
    $scope.messageLog = $scope.opponent.name + " disconnected... Redirecting to the Waiting Room. ";
    $scope.seconds = 5;
    // setInterval(function(){
    //   $scope.seconds--;
    //   console.log($scope.seconds);
    //   $scope.$digest();
    // },1000);
    setTimeout(function() {
      mySocket.removeAllListeners();
      mySocket.on('foundOpponents', function(player, img) {
        console.log(player, img);
        $scope.opponent = opponent;
        $scope.opponent.name = player;
        $scope.opponent.img = img;
        loadCanvas(img, "opponentPic")
        console.log(document.getElementById("opponentPic"), img);
        console.log("your opponent is ", $scope.opponent.name);
        $state.go('battle.fight');
      });
      mySocket.emit('ready', $scope.user.name);
      $state.go('battle.waiting'); //returning to waiting room
    }, 5000);

  });


  //Game Mechanics



  mySocket.on('new note', function(note) {
    $scope.currentNote = note;
    console.log("received note", note);
    MusicalCanvas.addNote(canvas, note);
    voice.listen(note);
  });

  //Receive a hit
  mySocket.on('pitchSlap', function() {
    console.log(mySocket.name + "received hit");
    voice.pause;
    $scope.user.hp = Math.max($scope.user.hp - 25, 0); //To be customized
    $scope.currentNote = '';
    $scope.round++;
  });

  //Emit a hit to opponents
  $scope.$on('correct', function() {
    correct();
  });

  $scope.correct = function() {
    correct();
  };

  function correct() {
    console.log(mySocket.name + "got it right!");
    voice.pause;
    $scope.currentNote = '';
    $scope.opponent.hp = Math.max($scope.opponent.hp - 25, 0); //To be customized
    $scope.round++;
    if ($scope.opponent.hp === 0) {
      game.won = true;
      mySocket.emit("room", $scope.room, 'end');
      $state.go('battle.end');
    } else {
      console.log("this is run! sending pitchslap to ", $scope.room);
      mySocket.emit("room", $scope.room, 'pitchSlap');
    }
  }

  mySocket.on("end", function() {
    mySocket.removeAllListeners();
    mySocket.on('foundOpponents', function(player, img) {
      console.log(player, img);
      $scope.opponent = opponent;
      $scope.opponent.name = player;
      $scope.opponent.img = img;
      loadCanvas(img, "opponentPic")
      console.log(img);
      console.log(document.getElementById("opponentPic"), img);
      console.log("your opponent is ", $scope.opponent.name);
      $state.go('battle.fight');
    });
    mySocket.emit('ready', $scope.nickName);
    $state.go('battle.end');
  });

  //If user is leaving the room; Note working. need to add on root State change from to
  $scope.$on('$locationChangeStart', function(scope, next, current) {
    if (!isOver && next.indexOf('waiting') !== -1) {
      alert("are you sure you want to leave?");
      mySocket.emit('disconnect');
      mySocket.emit('ready', $scope.user.name);
      // console.log('going home');
    }
  });
});

//$location.url() not working
// $scope.getlocation= function(){
//   console.log($location.url());
//   return $location.url();
// };