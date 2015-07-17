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

    var videoDuration = function(){
        var time = 0;
        timeline.slides.forEach(function(slide){
            time += slide.duration;
        })
        console.log(time);
        return time;
    }

    return {
        slides: slides,
        videoDuration: videoDuration
    }
}]);
