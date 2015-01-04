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
            $scope.itemClick = function(trackObj, tracks){
                $rootScope.$broadcast("trackChangedEvent", { trackObject: trackObj, tracks: tracks });
                $rootScope.setHash(trackObj);
            };
        }
    };
});