angular.module('Timeline', ['TimelineService']).controller('TimelineCtrl', function($scope, timeline) {
	var count = localStorage.length;

	$scope.save = function(){
		localStorage.setItem(count, count);
		count++;
	};
	$scope.load = function(){
		localStorage.getItem("example");
		count++;
	};
	$scope.clear = function(){
		localStorage.clear();
	};

	$scope.slide = function(){
		$scope.fillSlides();
		if ($("#timeline").hasClass("slideup")){
			$(".right, .left").css("margin-bottom",250);
            $("#timeline").removeClass("slideup").addClass("slidedown");
        } else {
            $("#timeline").removeClass("slidedown").addClass("slideup");
        }
	};

	$scope.fillSlides = function(){
		$scope.slides = timeline.slides;
		console.log(timeline.slides);
	}

	$scope.slides = [];

	this.dropCallback = function(event, ui, title, $index) {
	  if ($scope.slides.map(function(item) { return item.title; }).join('') === 'GOLLUM') {
	    $scope.slides.forEach(function(value, key) { $scope.slides[key].drag = false; });
	  }
	};

});
