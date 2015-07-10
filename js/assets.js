angular.module('AssetsService', []).factory("assets", ['$http', function(){
	var loadXMLDoc = function(callback) {
		var req = new XMLHttpRequest();
			req.onload = function() {
				console.log("loaded");
				callback(req.response);
			}
		req.open("GET", "/assets/articles/article0.json", true);
		req.send();
	}
	return {loadXMLDoc: loadXMLDoc};
}]);

