angular.module('TimelineService', ['ConfigService']).factory('timeline', [function(Config) {

    var slides = [];
    var active = [];

    var videoDuration = function(){
        var time = 0;
        slides.forEach(function(slide){
            time += slide.duration;
        })
        return time/50;
    }


    return {
        slides: slides,
        videoDuration: videoDuration
    }
}]);
