app.config(function ($stateProvider) {
    $stateProvider.state('battle', {
        url: '/battle',
        templateUrl: 'js/battle/battle.html',
        controller:'BattleCtrl'
    });
});