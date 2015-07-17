angular.module('Assets', ['AssetService', 'ConfigService', 'TimelineService']).controller("AssetCtrl", function ($scope, $sce, assets, Config, timeline) {

	$scope.showPhoto = true;
	$scope.showText = true;
	$scope.assets = {
		quotes: [],
		images: [],
		metadata: []
	};


	$scope.trustHTML = function(string) {
		return $sce.trustAsHtml(string);
	};

	$scope.getArticle = function() {
		assets.getData().then(function(data) {
			console.log(data);
			$scope.assets = data;
			$scope.$parent.assets = data;
			console.log("Hello");
		});
	}

	$scope.getArticle();

	// set configs length

});
