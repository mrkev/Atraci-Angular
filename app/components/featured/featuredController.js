app.controller('featuredController', function ($scope, apiService) {
    $scope.artist = {
        imageCover : null,
        imageSmall : null,
        name : null
    };
    apiService.artist("Katy Perry", function (artist) {
        $scope.artist = {
            imageCover : artist.images[0].url,
            imageSmall : artist.images[2].url,
            name : artist.name
        }

    });
});