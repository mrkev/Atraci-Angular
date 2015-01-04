app.controller('homeController', function ($scope, apiService) {
        $scope.topTracks = {};

        apiService.getTopTracks().success(function(response){
            for(var i in response.feed.entry)
            {
                var track = response.feed.entry[i],
                    currentTrackHash = track['im:artist'].label + '___' + track['im:name'].label;

                if(!$scope.topTracks[currentTrackHash])
                {
                    $scope.topTracks[currentTrackHash] = {
                        title : track['im:name'].label,
                        artist : track['im:artist'].label,
                        cover_url_medium : track['im:image'][1].label,
                        cover_url_large : track['im:image'][2].label
                    };
                }
            }
        });
    });