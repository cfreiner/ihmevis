var app = angular.module('IHME', ['ngRoute', 'IhmeCtrls', 'ui.bootstrap', 'rzModule']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/bar', {
      templateUrl: '/app/views/bar.html',
      controller: 'BarCtrl'
    })
    .when('/map', {
      templateUrl: '/app/views/map.html',
      controller: 'MapCtrl'
    })
    .otherwise({
      templateUrl: '/app/views/about.html'
    });
  $locationProvider.html5Mode(true);
}]);
