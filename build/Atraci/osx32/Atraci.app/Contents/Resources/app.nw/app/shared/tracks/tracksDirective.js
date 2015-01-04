app.directive('tracks', function($rootScope){
    return {
        restrict : 'E',
        replace: true,
        transclude: false,
        scope : {
            items : '='
        },
        templateUrl : "assets/templates/trackItem.html",
        link: function ($scope, elements) {
            $scope.currentHash = null;

            $scope.itemClick = function(trackObj){
                $rootScope.$broadcast("trackChangedEvent", {trackObject: trackObj });
                $scope.currentHash = $scope.getHash(trackObj);
                $scope.apply();
            };

            $scope.getHash = function (trackObj) {
                return trackObj.artist + trackObj.title;
            }
        }
    };
});