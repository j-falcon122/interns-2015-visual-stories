angular.module('ConfigService', []).factory('Config', [function() {
    var configs = {};

    var settings = {
        article: 0,
        duration: 2500,
        fadeOut: 1000,
        fadeIn: 1000,
        hasFade: false,
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
            slide.enable = true;
            slide.kenBurns = settings.kenBurns;
            slide.drag = true;
            slide.fadeOut = settings.fadeOut;
            slide.fadeIn = settings.fadeIn;
            slide.hasFade = Math.random() > .8 ? true : false;
            slide.panning = slide.kenBurns > 0;
            return slide;
        },
        settings: settings,
    };


    // length of assets
    // photos for each asset
    // save timeline
}]);
