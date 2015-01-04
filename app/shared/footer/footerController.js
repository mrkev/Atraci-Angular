app.controller('footerController', function ($scope, playerService) {
    var ytdl = require('ytdl'),
        request = require('request'),
        moment = require('moment');

    $scope.currentPlayingTrack = {
        title : "No Track Selected",
        artist : "No Track Selected",
        cover_url_medium : "",
        cover_url_large : ""
    };

    $scope.currentProgressPercent = "0";
    $scope.currentProgress = "00:00 / 00:00";
    $scope.currentLoadProgress = "0";
    $scope.currentVolume = "100%";
    $scope.currentHash = null;
    $scope.currentPlayingTrackString = $scope.currentPlayingTrack.artist + " - " + $scope.currentPlayingTrack.title;
    $scope.player = playerService;

    playerService.init();

    $scope.$on('trackChangedEvent', function(event, args){
        $scope.currentPlayingTrack = args.trackObject;
        $scope.currentHash = $scope.getHash(args.trackObject);

        $scope.getVideo({
            url : 'http://gdata.youtube.com/feeds/api/videos?alt=json&max-results=1&q=' + encodeURIComponent(args.trackObject.artist + ' - ' + args.trackObject.title),
            json : true
        }, function (error, response, data) {
            if(!data.feed.entry)
            {
                console.log("Not Found");
                return false;
            }

            $scope.getInfo(data.feed.entry[0].link[0].href, { downloadURL : true }, function (err, info) {
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
    });

    playerService.ready(function(){
        this.on('timeupdate', function () {
            var trackDurationFormatted = moment(this.duration()*1000).format("m:ss"),
                trackProgressFormatted = moment(this.currentTime()*1000).format("m:ss");

            $scope.currentProgressPercent = (this.currentTime() / this.duration() * 100) + "%";
            $scope.currentProgress = trackProgressFormatted + " / " + trackDurationFormatted;
            $scope.$apply();
        });

        this.on('progress', function () {
            $scope.currentLoadProgress = playerService.getLoadingProgress() + "%";
        });
    });

    $scope.getHash = function(trackObject) {
        return trackObject.title + "-" + trackObject.artist;
    };

    $scope.getVideo = function(options, cb){
        request(options, cb);
    };

    $scope.setVolume = function($event) {
        var calculatedPercent = ($event.offsetX / $event.target.clientWidth) * 100;
        $scope.currentVolume = calculatedPercent + "%";
        playerService.setVolume(calculatedPercent);
    };
    
    $scope.getInfo = function (link, options, cb) {
        ytdl.getInfo(link, options, cb);
    };
});