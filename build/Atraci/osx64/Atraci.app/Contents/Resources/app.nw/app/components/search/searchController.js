app.controller('searchController', function ($scope, $routeParams, apiService) {
    $scope.searchTracks = apiService.search($routeParams.string);
});