app.controller('playerController', function ($scope) {
    var ytdl = require('ytdl'),
        request = require('request'),
        moment = require('moment');

    $scope.currentPlayingTrack = {
        title : "No Track Selected",
        artist : "No Track Selected",
        cover_url_medium : "",
        cover_url_large : ""
    };

    $scope.currentProgress = "50%";
    $scope.currentHash = null;
    $scope.currentPlayingTrackString = $scope.currentPlayingTrack.artist + " - " + $scope.currentPlayingTrack.title;

    videojs('video_player', {
        controls : false,
        preload : "auto"
    });

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
            }
            else
            {
                $scope.getInfo(data.feed.entry[0].link[0].href, { downloadURL : true }, function (err, info) {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        var streamUrls = [];
                        var itag_priorities = [85,43,82];

                        for(var f in info.formats)
                        {
                            var currentFormat = info.formats[f];
                            streamUrls[currentFormat.itag] = currentFormat.url;
                        }

                        for(var it in itag_priorities)
                        {
                            if(streamUrls[itag_priorities[it]])
                            {
                                videojs('video_player').src(streamUrls[itag_priorities[it]]).play();
                            }
                        }
                    }
                })
            }
        })
    });

    videojs('video_player').ready(function(){
        this.on('loadedmetadata', function () {

        });

        this.on('timeupdate', function () {
            $scope.currentProgress = (this.currentTime() / this.duration() * 100) + "%";
            $scope.$apply();
        });
    });

    $scope.getHash = function(trackObject) {
        return trackObject.title + "-" + trackObject.artist;
    };

    $scope.getVideo = function(options, cb){
        request(options, cb);
    };
    
    $scope.getInfo = function (link, options, cb) {
        ytdl.getInfo(link, options, cb);
    };
});