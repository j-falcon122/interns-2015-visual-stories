angular.module('ConfigService', []).factory('Config', [function() {
    var configs = {};

    return {
        //Get people saved so far.
        get: function() {
            return configs;
        },

        //Create new batch of people
        set: function(new_configs) {
            configs = new_configs;
        }
    };


    // length of assets
    // photos for each asset
    // save timeline
}]);
