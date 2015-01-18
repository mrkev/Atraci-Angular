var app = angular.module('AtraciApp', ['ngRoute', 'ngAnimate', 'angular-loading-bar'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $routeProvider
            .when('/featured', {
                'controller'  : 'featuredController',
                'templateUrl' : 'app/components/featured/featuredView.html'
            })
            .when('/donate', {
                'templateUrl' : 'app/components/donate/donateView.html'
            })
            .when('/search/:string', {
                'controller'  : 'searchController',
                'templateUrl' : 'app/components/search/searchView.html'
            })
            .when('/settings', {
                'templateUrl' : 'app/components/settings/settingsView.html'
            })
            .when('/history', {
                'controller'  : 'historyController',
                'templateUrl' : 'app/components/history/historyView.html'
            })
            .when('/newplaylist', {
                'controller'  : 'newPlaylistController',
                'templateUrl' : 'app/components/playlist/newPlaylistView.html'
            })
            .when('/home', {
                'controller'  : 'homeController',
                'templateUrl' : 'app/components/home/homeView.html'
            })
            .otherwise({'redirectTo' : '/home'});
    }]);