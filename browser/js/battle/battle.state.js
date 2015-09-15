app.config(function ($stateProvider) {
    $stateProvider.state('battle', {
        // url: '/battle',
        templateUrl: 'js/battle/battle.html',
        controller:'BattleCtrl',
        resolve: {
          nickName: function(user){
            return user.getName();
          }
        }
    })
    .state('battle.waiting',{
        // url:'/waiting',
        templateUrl: "js/battle/waiting-screen.html"
    })
    .state('battle.fight',{
        url:'/fight',
        templateUrl: "js/battle/fight.html",
        controller: "FightCtrl",
    })
    .state('battle.end',{
        url:'/end',
        controller: 'EndCtrl',
        templateUrl:"js/battle/end.html"
    })
    ;
});