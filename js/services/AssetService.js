angular.module('AssetService', []).factory("assets", ['$http', function($http){
	var getData = function() {
		return $http({
			method: 'GET',
        	url: '/assets/articles/article0.json'
		})
	}
	return {getData: getData};
}]);
