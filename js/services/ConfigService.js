angular.module('ConfigService', []).factory('Config', [function() {
    var configs = {};
    var settings = {
        article: 0,
        duration: 500,
        fadeTime: 250,
        fadeOut: true,
        fadeIn: true,
        recording: false
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
        settings: settings
    };


    // length of assets
    // photos for each asset
    // save timeline
}]);
