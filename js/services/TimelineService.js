angular.module('TimelineService', ['ConfigService']).factory('timeline', [function(Config) {

    var slides = [];
    /*
    slide.obj = {
        thumb
        enabled
        json
        duration
    }
    */
    return {
        slides: slides
    }
}]);
