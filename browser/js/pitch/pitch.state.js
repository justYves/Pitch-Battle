app.config(function ($stateProvider) {
    $stateProvider.state('pitch', {
        url: '/pitch',
        templateUrl: 'js/pitch/pitch.html',
        controller:'PitchCtrl'
    });
});