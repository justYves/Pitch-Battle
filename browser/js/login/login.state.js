app.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'loginCtrl'
    })
    .state('login.name',{
      // url:'/login',
      templateUrl:'js/login/login.name.html'
    })
    .state('login.picture',{
      // url:'logi,n'
      templateUrl:'js/login/login.pic.html',
      controller:'loginPicCtrl'
    });
});