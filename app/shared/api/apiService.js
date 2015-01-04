app.factory('apiService', function ($http) {
        var Api = {
            'results' : {},
            'providers' : {
                'itunes' : {
                    'search' : "http://itunes.apple.com/search?media=music&limit=100&entity=song&term=",
                    'topTracks' : "http://itunes.apple.com/rss/topsongs/limit=100/explicit=true/json",
                    'parser' : 'itunesResultsParser'
                },
                'lastFm' : {
                    'search' : "http://ws.audioscrobbler.com/2.0/?api_key=c513f3a2a2dad1d1a07021e181df1b1f&format=json&method=track.search&track=",
                    'parser' : 'lastFmResultsParser'
                },
                'soundcloud' : {
                    'search' : "https://api.soundcloud.com/tracks.json?client_id=dead160b6295b98e4078ea51d07d4ed2&q=",
                    'parser' : 'soundCloudResultsParser'
                }
            }
        };

        Api.getTopTracks = function () {
            return $http({
                method: 'GET',
                url: Api.providers.itunes.topTracks
            });
        };

        Api.search = function (str) {

            for(var p in Api.providers)
            {
                (function e(provider) {
                    var currentProviderSearchUrl = provider.search + str,
                        currentProviderParser = Api[provider.parser];
                    $http({
                        method : 'GET',
                        url: currentProviderSearchUrl
                    }).success(function (data) {
                        if(data) currentProviderParser(data);
                    });
                }(Api.providers[p]));
            }

            return Api.results;
        };

        Api.itunesResultsParser = function (data) {
            var dataTracks = data.results;
            for(var r in dataTracks)
            {
                var currentResult = dataTracks[r],
                    imageMedium = currentResult.artworkUrl60 ? currentResult.artworkUrl60 : false,
                    imageLarge = currentResult.artworkUrl100 ? currentResult.artworkUrl100 : false;

                Api.addResult(currentResult.trackName, currentResult.artistName, imageMedium, imageLarge);
            }
        };

        Api.lastFmResultsParser = function (data) {
            var dataTracks = data.results.trackmatches.track;
            for(var r in dataTracks)
            {
                var currentResult = dataTracks[r],
                    currentImage = currentResult.image ? currentResult.image : false,
                    imageMedium = currentImage ? currentImage[1] : false,
                    imageLarge = currentImage ? currentImage[currentResult.image.length -1] : false;

                Api.addResult(currentResult.name, currentResult.artist, imageMedium, imageLarge);
            }
        };

        Api.soundCloudResultsParser = function (data) {
            for(var r in data)
            {
                var currentResult = data[r],
                    currentImage = currentResult.artwork_url ? currentResult.artwork_url : false,
                    nameExploded = currentResult.title.split("-");

                Api.addResult(nameExploded[0], nameExploded[1], currentImage, currentImage);
            }
        };

        Api.getHash = function (trackObj) {
            return (trackObj.artist + trackObj.title).replace(/\s+/g, '').toLowerCase();
        };

        Api.objConcat = function (obj1, obj2) {
            for(var key in obj2)
            {
                obj1[key] = obj2[key];
            }
            return obj1;
        };

        Api.addResult = function(title, artist, coverMedium, coverLarge) {
            var result = {
                title : title,
                artist : artist,
                cover_url_medium : coverMedium,
                cover_url_large : coverLarge
            };

            Api.results[Api.getHash(result)] = result;
        };

        return Api;
    });