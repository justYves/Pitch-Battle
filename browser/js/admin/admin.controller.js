app.controller('AdminCtrl', function($scope,mySocket) {

  $scope.getInfo = function(){
    mySocket.emit('admin');
  };

  mySocket.on('data',function(rooms,clients,waitingRoom){
    $scope.rooms = rooms;
    $scope.clients = clients;
    $scope.waitingRoom = waitingRoom;
  });



});