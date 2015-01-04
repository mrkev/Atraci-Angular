app.controller('homeController', function ($scope, apiService) {
        $scope.topTracks = apiService.getTopTracks();
    });