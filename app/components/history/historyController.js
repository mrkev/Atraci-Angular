app.controller('historyController', function ($scope, DBService) {
    $scope.historyItems = [];

    DBService.getAllHistory(function (data) {
        $scope.historyItems = data;
    });
});