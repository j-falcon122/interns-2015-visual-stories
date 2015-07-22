angular.module('Assets', ['AssetService', 'ConfigService', 'TimelineService', 'ui.bootstrap']).controller("AssetCtrl", function ($scope, $sce, assets, Config, timeline) {

	$scope.showPhoto = false;
	$scope.showText = false;
	$scope.showQuotes = false;
	$scope.assets = {
		quotes: [],
		images: [],
		metadata: []
	};


	$scope.$on('article:load', function(event, url) {
		assets.getData(url).then(function(data) {
			$scope.assets = data;
		});
	});

	$scope.trustHTML = function(string) {
		return $sce.trustAsHtml(string);
	};
});
