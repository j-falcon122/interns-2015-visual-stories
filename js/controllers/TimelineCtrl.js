angular.module('Timeline', ['TimelineService']).controller('TimelineCtrl', function($scope, timeline) {
    var count = localStorage.length;

    $scope.save = function() {
        localStorage.setItem(count, count);
        count++;
    };
    $scope.load = function() {
        localStorage.getItem("example");
        count++;
    };
    $scope.clear = function() {
        localStorage.clear();
    };

    $scope.slide = function() {
        $scope.fillSlides();
        if ($("#timeline").hasClass("slideup")) {
            $(".right, .left").css("margin-bottom", 250);
            $("#timeline").removeClass("slideup").addClass("slidedown");
        } else {
            $("#timeline").removeClass("slidedown").addClass("slideup");
        }
    };

    $scope.status = function() {
        console.log(timeline.slides);
    };

    $scope.fillSlides = function() {
        $scope.slides = timeline.slides;
    };

    $scope.slides = [];

    $scope.removeSlide = function(index){
    	timeline.slides.splice(index, 1);
    }



    this.dropCallback = function(event, ui, title, $index) {
        console.log("event", event);
        console.log("ui", ui);
        console.log("title", title);
        console.log("$index", $index);
        if ($scope.slides.map(function(item) {
                return item.title;
            }).join('') === 'GOLLUM') {
            $scope.slides.forEach(function(value, key) {
                $scope.slides[key].drag = false;
            });
        }
    };

    this.dragCallback = function(event, ui, title, $index) {
        console.log(event, ui, title, $index);
    };

});
