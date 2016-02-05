var app = angular.module('IHME', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/views/bar.html',
    controller: 'BarCtrl'
  })
  .otherwise({
    templateUrl: '/app/views/404.html'
  });
  $locationProvider.html5Mode(true);
}]);
