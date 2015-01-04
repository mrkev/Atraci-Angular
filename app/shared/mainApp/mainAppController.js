app.controller("MainAppController", function($rootScope, $scope, $location){
    $scope.searchTerm = null;
    $scope.version = require('./package.json').version;

    $scope.doSearch = function ($event) {
        if($event.keyCode == 13)
        {
            $location.path('search/' + $scope.searchTerm);
        }
    };
});