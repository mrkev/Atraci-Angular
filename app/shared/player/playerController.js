app.factory('playerService', function () {
    return {
        element : "video_player",
        isPlaying : false,
        ref : null,
        init: function(){
            this.ref = videojs(this.element, {
                controls : false,
                preload : "auto"
            });
            return this;
        },
        stop : function () {
            this.ref.stop();
            return this;
        },
        play : function () {
            this.isPlaying = true;
            this.ref.play();
            return this;
        },
        pause : function () {
            this.ref.pause();
            return this;
        },
        togglePlay : function(){
            this.isPlaying ? this.play() : this.pause();
            this.isPlaying = !this.isPlaying;
            return this;
        },
        setSrc : function (src) {
            this.ref.src(src);
            return this;
        },
        playSource : function(src)
        {
            this.ref.src(src).play();
            return this;
        },
        ready : function(obj) {
            this.ref.ready(obj);
            return this;
        },
        goToDuration : function (event) {
            var elementWidth = event.target.offsetWidth,
                clickOffsetX = event.offsetX,
                percent = (clickOffsetX / elementWidth) * this.ref.duration();
            this.ref.currentTime(percent);
        },
        getLoadingProgress : function() {
            return this.ref.bufferedPercent() * 100;
        }
    };
});