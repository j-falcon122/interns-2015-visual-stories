angular.module('Timeline', ['TimelineService']).controller('TimelineCtrl', function($scope, timeline, Config) {
    var count = localStorage.length;
    $scope.slides = [];

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
        {value: 500, label: '0.5 secs'},
        {value: 1000, label: '1 sec'},
        {value: 1500, label: '1.5 secs'},
        {value: 2000, label: '2 secs'},
        {value: 2500, label: '2.5 secs'},
        {value: 3000, label: '3 secs'}
    ];

    $scope.fillSlides = function() {
        $scope.slides = timeline.slides;
    };

    $scope.randomKen = function (slide) {
        slide.kenBurns = Math.ceil(Math.random() * 5);
    };

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
