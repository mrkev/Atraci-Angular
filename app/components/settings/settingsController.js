app.controller('settingsController', function ($scope, storageService) {
    this.storage = storageService;
    this.SettingsStorageModel = {
        ShowNotifications : "Settings.ShowNotifications",
        VideoQuality : "Settings.VideoQuality",
        Language : "Settings.Language",
        Theme : "Settings.Theme"
    } ;
});