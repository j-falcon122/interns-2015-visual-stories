angular.module('Timeline', ['TimelineService']).controller('TimelineCtrl', function($scope, timeline, Config) {
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

    $scope.log = function() {
        console.log($scope.slides);
    }

    $scope.slide = function() {
        $scope.fillSlides();
        if ($("#timeline").hasClass("slideup")) {
            $(".right").css("margin-bottom", 250);
            $("#timeline").removeClass("slideup").addClass("slidedown");
        } else {
            $("#timeline").removeClass("slidedown").addClass("slideup");
        }
    };

    $("#duration").slider({
      min: 10,
      max: 100,
      value: 50,
      slide: function(event, ui) {
        fontsize = ui.value;
        return render();
      }
    });

    $scope.durations = [
        500,
        1000,
        1500,
        2000,
        2500,
        3000,
    ];

    $scope.duration = 1000;

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
        // console.log("event", event);
        // console.log("ui", ui);
        // console.log("title", title);
        // console.log("$index", $index);
    };
});
