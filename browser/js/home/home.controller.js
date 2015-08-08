app.controller('MainCtrl', function($scope, user) {
  $scope.nickName = user.getName();
  $scope.register = function(name) {
    $scope.nickName = user.setName(name)
  };
});