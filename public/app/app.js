var app = angular.module('IHME', ['ngRoute', 'IhmeCtrls', 'ui.bootstrap', 'rzModule']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/views/bar.html',
      controller: 'BarCtrl'
    })
    .when('/map', {
      templateUrl: '/app/views/map.html',
      controller: 'MapCtrl'
    })
    .otherwise({
      templateUrl: '/app/views/404.html'
    });
  $locationProvider.html5Mode(true);
}]);
