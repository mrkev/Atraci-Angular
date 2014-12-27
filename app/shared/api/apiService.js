angular.module('AtraciApp.Services', [])
    .factory('apiService', function ($http) {
        var Api = {};
        var providers = {
            'itunes' : {
                'topTracks' : "http://itunes.apple.com/rss/topsongs/limit=100/explicit=true/json"
            },
            'lastFm' : {},
            'soundcloud' : {}
        };
        
        Api.getTopTracks = function () {
            return $http({
                method: 'GET',
                url: providers.itunes.topTracks
            });
        };

        return Api;
    });