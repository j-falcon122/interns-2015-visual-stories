angular.module('Timeline', []).controller('TimelineCtrl', function($scope) {
	var count = localStorage.length;
	var initialize = function(){
		$scope.canvas = new fabric.Canvas('canvas');
	}
	var render = function(){
		$scope.status = localStorage.length;
	}
	$scope.save = function(){
		localStorage.setItem(count, count);
		count++;
		render();
	}
	$scope.load = function(){
		localStorage.getItem("example");
		count++;
		render();
	}
	$scope.clear = function(){
		localStorage.clear();
		render();
	}
	$scope.print = function(){
		console.log(localStorage);
	}
	initialize();
	render();
});
