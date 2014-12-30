app.factory('storageService', function () {
    var Storage = {};

    Storage.set = function(item, value){
        localStorage.setItem(item, value);
    };

    Storage.get = function(item){
        localStorage.getItem(item);
    };

    Storage.remove = function(item){
        localStorage.removeItem(item);
    };

    return Storage;
});