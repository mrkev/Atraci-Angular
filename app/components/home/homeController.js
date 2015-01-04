app.controller('homeController', function ($scope, apiService) {
        $scope.topTracks = {};
        $scope.topTracks = apiService.getTopTracks();
    });