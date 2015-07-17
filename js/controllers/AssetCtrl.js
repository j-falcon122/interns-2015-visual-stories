angular.module('Assets', ['AssetService', 'ConfigService', 'TimelineService', 'ui.bootstrap']).controller("AssetCtrl", function ($scope, $sce, assets, Config, timeline) {

	$scope.showPhoto = false;
	$scope.showText = false;
	$scope.showQuotes = false;
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
