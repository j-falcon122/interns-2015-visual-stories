angular.module('Assets', ['AssetService']).controller("AssetCtrl", function ($scope, $sce, assets) {

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
		});
	}
});




