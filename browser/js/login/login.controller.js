app.controller('loginCtrl', function($scope, user,$state) {
  $scope.nickName = user.getName();
  $scope.register = function(name) {
    console.log(name);
    // if($scope.nickName!=="Anonymous" && name !== ""){
      $scope.nickName = user.setName(name);
    // }
    // $state.go("login.picture");
  };
});