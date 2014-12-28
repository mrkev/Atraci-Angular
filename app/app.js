var app = angular.module('AtraciApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider){
        $routeProvider
            .when('/featured', {
                'templateUrl' : 'app/components/featured/1232.html'
            })
            .when('/home', {
                'controller'  : 'homeController',
                'templateUrl' : 'app/components/home/homeView.html'
            })
            .otherwise({'redirectTo' : '/home'});
    }]);