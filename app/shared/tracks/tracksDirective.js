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

app.directive("trackContextMenu", function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, elements, attrs) {
            elements[0].addEventListener('contextmenu', function (event) {
                var self = this;
                var gui = require('nw.gui');
                var menu = new gui.Menu();

                for(var i=0;i<$rootScope.playlists.length;i++)
                {
                    var current = $rootScope.playlists[i];
                    menu.append(new gui.MenuItem({
                        label : "Add to " + current.name,
                        click : (function (current) {
                            return function(){
                                $scope.addTrackToPlaylist(angular.element(event.srcElement.parentElement).data().$scope.track, current._id);
                            }
                        })(current)
                    }));
                }

                menu.append(new gui.MenuItem({type : "separator"}));
                menu.append(new gui.MenuItem({
                    label : "Temp"
                }));

                menu.popup(event.clientX, event.clientY);
            });

            $scope.addTrackToPlaylist = function (trackObject, pid) {
                $rootScope.$broadcast("addTrackToPlaylist", { trackObject : trackObject, playlistID : pid });
            };
        }
    };
});