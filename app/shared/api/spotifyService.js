app.factory('spotifyService', function ($http) {
    var Spotify = {
        baseURL : "https://api.spotify.com/v1/",
        clientID : "d70cc4ebc8134b3286bac66a579a4c43",
        clientSecret : "0d06d79bc0094517b692defb05233748",
        methods : {
            "SEARCH" : "search",
            "ARTIST" : 'artists'
        }
    };

    Spotify.search = function (term, callback) {
        this.request(this.methods.SEARCH, { q : term, type : 'track' }, function (data) {
            callback(data);
        });
    };

    Spotify.artist = function (name, callback) {
        this.request(this.methods.SEARCH, { q : name, type : 'artist' }, function (data) {
            callback(data);
        });
    };

    Spotify.request = function (method, params, callback) {
        $http.get(this.buildUrl(method, params))
            .success(function (data, status, headers) {
                callback(data);
            });
    };

    Spotify.buildUrl = function (method, params) {
        var URL = this.baseURL + method;
        if(params)
        {
            var tempRet = [];
            for(var d in params)
                tempRet.push(encodeURIComponent(d) + "=" + encodeURIComponent(params[d]));

            URL += "?" + tempRet.join("&");
        }
        return URL;
    };

    return Spotify;
});