angular.module('ConfigService', []).factory('Config', [function() {
    var configs = {};

    var settings = {
        duration: 2500,
        fadeOut: 1000,
        fadeIn: 1000,
        kenBurns: 5,
        recording: true,
        width: 600,
        height: 400
    };

    return {
        //Get people saved so far.
        get: function() {
            return configs;
        },
        //Create new batch of people
        set: function(new_configs) {
            configs = new_configs;
        },
        defaultSlide: function(json) {
            var slide = {};
            slide.json = json;
            slide.duration = settings.duration;
            slide.kenBurns = settings.kenBurns;
            slide.fadeOut = settings.fadeOut;
            slide.fadeIn = settings.fadeIn;
            slide.thumb = createThumbnail();
            return slide;
        },
        settings: settings,
    };
}]);
