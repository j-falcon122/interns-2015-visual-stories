angular.module('Assets', ['AssetService', 'ConfigService', 'TimelineService', 'ui.bootstrap']).controller("AssetCtrl", function ($scope, $sce, assets, Config, timeline) {

	$scope.showPhoto = false;
	$scope.showText = false;
	$scope.showQuotes = false;
	$scope.assets = null;
    $scope.loadedImages = 0;

	$scope.$on('article:load', function(event, url) {
		assets.getData(url).then(function(data) {
			$scope.assets = data;
		});
	});

    $scope.imageLoaded = function() {
        $scope.loadedImages++;
        if ($scope.assets.images.length == $scope.loadedImages) {
            $scope.$emit('assets:ready');
        }
    }
});
