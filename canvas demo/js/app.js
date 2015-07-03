



	// images.forEach(function(pic, it){
	// 	content.append("<img src='" + pic.url + "'><p>" + pic.caption +"</p><p>" + pic.credit + "</p>");
	// })
	// slideshow.forEach(function(pic, it){
	// 	content.append("<img src='" + pic.url + "'><p>" + pic.caption +"</p><p>" + pic.credit + "</p>");
	// })

var loadData = angular.module ('timesTrailer', []);
loadData.controller ("importData", function ($scope, $sce) {
	$scope.trustHTML = function(string) {
		return $sce.trustAsHtml(string);
	};
	loadXMLDoc(function(data){
		$scope.images = [];
		$scope.slideshow = [];
		$scope.article = JSON.parse(data);
		createItems($scope.article, $scope);
		console.log($scope.article.result.headline);
		$scope.$apply();
	});
});

function loadXMLDoc(callback) {
	var req = new XMLHttpRequest();
		req.onload = function() {
			console.log("loaded");
			callback(req.response);
		}
	req.open("GET", "/articles/article0.json", true);
	req.send();
}

function createItems(data, $scope){
	$scope.article.headline = data.result.headline;
	$scope.article.summary = data.result.summary;
	$scope.article.section = data.result.section.display_name;
	$scope.article.author = data.result.authors[0].title_case_name;
	$scope.article.byline = data.result.byline
	$scope.article.date = data.result.publication_iso_date;
	$scope.article.kicker = data.result.kicker;
	$scope.article.Top = data.result.regions.Top.modules[0].modules;
	$scope.article.Embedded = data.result.regions.Embedded.modules[0].modules;
	getImages($scope.article.Top, $scope);
	getImages($scope.article.Embedded, $scope);
	$scope.$apply();
}

function getImages(section, $scope){
	$.each(section, function(id){
		if(typeof(section[id].image) !== "undefined"){
			if(section[id].display_size !== "SMALL"){
				$scope.images.push({
					"url": section[id].image.image_crops.articleLarge.url,
					"credit": section[id].image.credit,
					"caption": section[id].image.caption.full
				});
			}
		}
		if(typeof(section[id].imageslideshow) !== "undefined"){
			section[id].imageslideshow.slides.forEach(function(slide){
				$scope.slideshow.push({
					"url": slide.image_crops.articleLarge.url,
					"credit": slide.credit,
					"caption": slide.caption.full
				})
			})
		}
	});
}

