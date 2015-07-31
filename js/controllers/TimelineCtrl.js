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

    $scope.$on("openSlide", function(){
        $scope.slideHidden = false;
        $scope.fillSlides();
    })

    $scope.slideHidden = true;

    $scope.durations = [
        500,
        1000,
        1500,
        2000,
        2500,
        3000,
    ];

    // "0.5 secs",
    // "1 sec",
    // "1.5 secs",
    // "2.0 secs",
    // "2.5 secs",
    // "3.0 secs"

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
    $scope.effectIndex = -1;

    $scope.effectShow = function(index){
    	if(index == $scope.effectIndex){
    		$scope.effectIndex = -1
    	} else {
    		$scope.effectIndex = index;
    	}
    };


    this.dropCallback = function(event, ui, title, $index) {
        console.log("worked");
    };
});
