app.controller("MainAppController", function($rootScope, $scope, $location){
    $scope.searchTerm = null;

    $scope.doSearch = function ($event) {
        if($event.keyCode == 13)
        {
            $location.path('search/' + $scope.searchTerm);
        }
    };
});