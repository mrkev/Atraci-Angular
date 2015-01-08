app.factory('playerService', function () {
    var PlayerService = {
        element : "video_player",
        isPlaying : true,
        ref : null
    };

    PlayerService.init = function() {
        this.ref = videojs(this.element, {
            controls: false,
            preload: "auto"
        });
        return this;
    };

    PlayerService.play = function () {
        this.ref.play();
        return this;
    };

    PlayerService.pause = function () {
        this.ref.pause();
        return this;
    };

    PlayerService.togglePlay = function () {
        !this.isPlaying ? this.play() : this.pause();
        this.isPlaying = !this.isPlaying;
        return this;
    };

    PlayerService.setSrc = function (src) {
        this.ref.src(src);
        return this;
    };

    PlayerService.playSource = function (src) {
        this.setSrc(src);
        this.play();
        this.isPlaying = true;
        return this;
    };

    PlayerService.ready = function (obj) {
        this.ref.ready(obj);
        return this;
    };

    PlayerService.goToDuration = function (event) {
        var elementWidth = event.target.offsetWidth,
            clickOffsetX = event.offsetX,
            percent = (clickOffsetX / elementWidth) * this.ref.duration();
        this.ref.currentTime(percent);
    };

    PlayerService.getLoadingProgress = function() {
        return this.ref.bufferedPercent() * 100;
    };

    PlayerService.setVolume = function (vol) {
        this.ref.volume(Math.floor(vol) / 100);
        return this;
    };

    return PlayerService;
});