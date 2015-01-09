app.factory('apiService', function ($rootScope, $http, spotifyService) {
        var Api = {
            'results' : [],
            'resultsTemp' : {},
            'providers' : {
                'itunes' : {
                    'search' : "http://itunes.apple.com/search?media=music&limit=100&entity=song&term=",
                    'topTracks' : "http://itunes.apple.com/rss/topsongs/limit=100/explicit=true/json",
                    'parser' : 'itunesResultsParser'
                }/**,
                'lastFm' : {
                    'autocomplete' : "http://www.last.fm/search/autocomplete?q=",
                    'search' : "http://ws.audioscrobbler.com/2.0/?api_key=c513f3a2a2dad1d1a07021e181df1b1f&format=json&method=track.search&track=",
                    'parser' : 'lastFmResultsParser'
                },
                'soundcloud' : {
                    'search' : "https://api.soundcloud.com/tracks.json?client_id=dead160b6295b98e4078ea51d07d4ed2&q=",
                    'parser' : 'soundCloudResultsParser'
                }**/
            }
        };

        Api.getTopTracks = function () {
            Api.results = [];
            Api.resultsTemp = {};
            $http({
                method: 'GET',
                url: Api.providers.itunes.topTracks
            }).success(function (data) {
                Api.itunesTopResultsParser(data);
            });

            return Api.results;
        };

        Api.search = function (str) {
            Api.results = [];
            Api.resultsTemp = {};
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

        Api.artist = function (name, callback) {
            spotifyService.artist(name, function (data) {
                if (data.artists && data.artists.items.length) {
                    var artist = data.artists.items[0];
                    callback(artist);
                }
                else {
                    console.log("NotFound: (artist) ", data);
                }
            });
        };

        Api.getAlbumsByArtistID = function (artistID, callback) {
            spotifyService.artistAlbums(artistID, function (data) {
                if(data.items)
                {
                    callback(data.items);
                }
                else
                {
                    console.log("NotFound: (artist album) ", data);
                }
            });
        };

        Api.getTracksByAlbumID = function (albumID, callback) {
            spotifyService.albumTracks(albumID, function (data) {
                if(data.items)
                {
                    callback(data.items);
                }
                else
                {
                    console.log("NotFound: (album tracks) ", data);
                }
            });
        };

        Api.getArtistWithFullAlbum = function (name, callback) {
            var self = this,
                artistObj = {};
            self.artist("Katy Perry", function (artist) {
                artistObj = {
                    id : artist.id,
                    imageCover : artist.images[0].url,
                    imageSmall : artist.images[2].url,
                    name : artist.name,
                    albums : []
                };

                self.getAlbumsByArtistID(artistObj.id, function (albums) {
                    var albumsKeys = {};
                    for(var i=0;i<albums.length;i++)
                    {
                        var album = albums[i],
                            albumNameHashed = album.name.replace(/\s*\(.*?\)\s*/g, '').replace(/\W/g, '').toLowerCase();

                        if(!albumsKeys[albumNameHashed])
                        {
                            albumsKeys[albumNameHashed] = true;
                            var albumObj = {
                                id : album.id,
                                name : album.name,
                                image : album.images[0]["url"],
                                artist : artistObj.name,
                                tracks : []
                            };

                            (function(albumObj){
                                self.getTracksByAlbumID(albumObj.id, function (tracks) {
                                    for(var x=0;x<tracks.length;x++)
                                    {
                                        var track = tracks[x];
                                        albumObj.tracks.push({
                                            id: track.id,
                                            name : track.name,
                                            artist : artistObj.name,
                                            trackNumber : track.track_number,
                                            duration : track.duration_ms
                                        });
                                    }
                                    artistObj.albums.push(albumObj);
                                });
                            })(albumObj);
                        }
                    }

                    callback(artistObj);
                });

            });
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

        Api.itunesTopResultsParser = function (data) {
            var dataTracks = data.feed.entry;
            for(var r in dataTracks)
            {
                var currentResult = dataTracks[r];
                Api.addResult(currentResult['im:name'].label, currentResult['im:artist'].label, currentResult['im:image'][1].label, currentResult['im:image'][2].label);
            }
        };

        Api.lastFmResultsParser = function (data) {
            var dataTracks = data.results.trackmatches.track;
            for(var r in dataTracks)
            {
                var currentResult = dataTracks[r],
                    currentImage = currentResult.image ? currentResult.image : false,
                    imageMedium = currentImage ? currentImage[1]['#text'] : false,
                    imageLarge = currentImage ? currentImage[currentResult.image.length -1]['#text'] : false;

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

        Api.getRandomCover = function () {
            var randomImages = ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'turquise', 'yellow'];
            return "assets/imgs/nocover/" + randomImages[Math.floor(Math.random()*randomImages.length)] + ".png";
        };

        Api.addResult = function(title, artist, coverMedium, coverLarge) {
            var randomCover = Api.getRandomCover();
            var result = {
                title : title ? title.replace(/ *\([^)]*\) */g, "") : "Unknown",
                artist : artist ? artist.replace(/ *\([^)]*\) */g, "") : "Unknown",
                cover_url_medium : (coverMedium ? coverMedium : randomCover),
                cover_url_large : (coverLarge ? coverLarge : randomCover)
            };

            result.hash = $rootScope.getHash(result);

            if(!Api.resultsTemp[result.hash])
            {
                result.index = Api.results.length;
                Api.resultsTemp[result.hash] = true;
                Api.results.push(result);
            }
        };

        return Api;
    });