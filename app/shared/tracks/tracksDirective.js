app.directive('tracks', function($rootScope){
    return {
        restrict : 'E',
        replace: true,
        transclude: false,
        scope : {
            items : '='
        },
        templateUrl : "assets/templates/trackItem.html",
        link: function ($scope) {
            $scope.itemClick = function($index, tracks){
                $rootScope.$broadcast("trackChangedEvent", { index: $index, tracks: tracks });
            };
        }
    };
});