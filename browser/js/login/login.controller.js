app.controller('loginCtrl', function($scope, user,$state) {
  $scope.nickName = user.getName();
  $scope.register = function(name) {
    console.log("1. I passed the loginCtrl with user data:", name);
  $scope.nickName = user.setName(name);
  };
});