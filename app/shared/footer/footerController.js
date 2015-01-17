app.controller('footerController', function ($rootScope, $scope, playerService, storageService) {
    var ytdl = require('ytdl'),
        request = require('request'),
        moment = require('moment');

    $scope.tracks = [];
    $scope.tracksHashes = [];
    $scope.currentPlayingTrack = {
        title : "No Track Selected",
        artist : "No Track Selected",
        cover_url_medium : "",
        cover_url_large : "",
        isDisabled : true,
        index : 0
    };
    $scope.currentProgressPercent = 0;
    $scope.currentProgress = "00:00 / 00:00";
    $scope.currentVolume = 100;
    $scope.playlistWidth = 0;
    $scope.currentPlayingTrackString = $scope.currentPlayingTrack.artist + " - " + $scope.currentPlayingTrack.title;
    $scope.player = playerService;

    playerService.init();

    $scope.$on('trackChangedEvent', function(event, args){
        $scope.tracks = args.tracks;
        $scope.tracksHashes = Object.keys(args.tracks);
        $scope.playlistWidth = (Object.keys($scope.tracks).length * 203) + "px";
        $scope.playTrack(args.index);
    });

    playerService.ready(function(){
        this.on('timeupdate', function () {
            var currentTime = this.currentTime(),
                duration = this.duration();
            $scope.currentProgressPercent = currentTime / duration * 100;
            $scope.currentProgress = moment(currentTime*1000).format("m:ss") + " / " + moment(duration*1000).format("m:ss");
            $scope.$apply();
        });

        this.on('ended', function () {
            $scope.goToNext();
        });
    });

    $scope.playTrack = function (index) {
        playerService.pause();
        $scope.currentPlayingTrack = $scope.tracks[index];
        $rootScope.setHash($scope.currentPlayingTrack);
        $scope.getVideo($scope.currentPlayingTrack.artist + ' - ' + $scope.currentPlayingTrack.title, function (error, data, videoId) {

            $scope.getInfo(videoId, { downloadURL : true }, function (err, info) {
                if(err)
                {
                    console.log(err);
                    return false;
                }

                var streamUrls = [],
                    itagPriorities = [85,43,82];

                for(var f in info.formats)
                {
                    var currentFormat = info.formats[f];
                    streamUrls[currentFormat.itag] = currentFormat.url;
                }

                for(var it in itagPriorities)
                    if(streamUrls[itagPriorities[it]])
                        playerService.playSource(streamUrls[itagPriorities[it]]);
            })
        })
    };

    $scope.getVideo = function(name, cb){
        var Youtube = require("youtube-api");
        Youtube.authenticate({
            type : "key",
            key  : "AIzaSyC6UnNP6_Axc4IOhKKp46zmhF2e-nP4rvQ"
        });

        Youtube.search.list({
            q : name,
            part : "snippet"
        }, function (err, data) {
            var returnUrl = "http://www.youtube.com/watch?v=" +data.items[0].id.videoId;
            cb(err, data, returnUrl);
        });
    };

    $scope.setVolume = function($event) {
        var calculatedPercent = ($event.offsetX / $event.target.clientWidth) * 100;
        $scope.currentVolume = calculatedPercent;
        playerService.setVolume(calculatedPercent);
        storageService.set();
    };

    $scope.getInfo = function (link, options, cb) {
        ytdl.getInfo(link, options, cb);
    };

    $scope.goToNext = function () {
        var next = $scope.currentPlayingTrack.index + 1;
        if(!$scope.tracks[next])
            next = 0;

        $scope.playTrack(next);
    };
    $scope.goToPrev = function () {
        var prev = $scope.currentPlayingTrack.index - 1;
        if(!$scope.tracks[prev])
            prev = $scope.tracks.length - 1;

        $scope.playTrack(prev);
    };
});