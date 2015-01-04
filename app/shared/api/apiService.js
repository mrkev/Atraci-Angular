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
                    'parser' : 'soundcloudResultsParser'
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
                        if(data)
                        {
                            currentProviderParser(data);
                        }
                    });
                }(Api.providers[p]));
            }

            return Api.results;
        };

        Api.itunesResultsParser = function (data) {
            //console.log("itunes", data);
            return {};
        };

        Api.lastFmResultsParser = function (data) {
            var dataTracks = data.results.trackmatches.track;

            for(var r in dataTracks)
            {
                var currentResult = dataTracks[r],
                    imageMedium = currentResult.image ? currentResult.image[1] : '',
                    imageLarge = currentResult.image ? currentResult.image[currentResult.image.length -1] : '',
                    result = {
                        title : currentResult.name,
                        artist : currentResult.artist,
                        cover_url_medium :imageMedium,
                        cover_url_large : imageLarge
                    };

                Api.results[Api.getHash(result)] = result;
            }
        };

        Api.soundcloudResultsParser = function (data) {
            //console.log("soundcloud", data);
            return {};
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

        return Api;
    });