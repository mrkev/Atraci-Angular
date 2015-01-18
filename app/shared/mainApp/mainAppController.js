app.controller("MainAppController", function($rootScope, $scope, $location, DBService){
    $scope.searchTerm = null;
    $scope.version = require('./package.json').version;
    $scope.isPlayerMax = false;
    $scope.$location = $location;
    $rootScope.playlists = [];
    $rootScope.currentHash = null;
    $rootScope.getHash = function(trackObj){
        return (trackObj.artist + trackObj.title).replace(/\s+/g, '').replace(/\W/g, '').toLowerCase();
    };

    $rootScope.setHash = function (trackObj) {
        $rootScope.currentHash = $rootScope.getHash(trackObj);
    };

    $scope.doSearch = function ($event) {
        if($event.keyCode == 13)
            $location.path('search/' + $scope.searchTerm);
    };

    $scope.togglePlaylist = function() {
        $scope.isPlayerMax = !$scope.isPlayerMax;
    };

    $scope.getLocationPath = function (path, startsWith) {
        return startsWith ? ($location.path().indexOf(path) == 0) : ($location.path() == path);
    };

    DBService.getAllPlaylists(function (data) {
        $rootScope.playlists = data;
    });

    $scope.$on('addTrackToPlaylist', function(event, args){
        var track = args.trackObject,
            playlistID = args.playlistID;
        DBService.InsertNewPlaylistTrack(track, playlistID);
    });
});