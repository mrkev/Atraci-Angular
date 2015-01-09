app.directive('albums', function($location){
    return {
        restrict : 'E',
        replace: true,
        transclude: false,
        scope : {
            items : '='
        },
        templateUrl : "assets/templates/albumItem.html",
        link: function (scope) {
            scope.searchItem = function (trackItem) {
                searchItem(trackItem.artist + " - " + trackItem.name);
            };

            scope.searchAlbum = function (albumObj) {
                searchItem(albumObj.artist + " - " + albumObj.name);
            };

            function searchItem(term)
            {
                $location.path('/search/' + term);
            }
        }
    };
});