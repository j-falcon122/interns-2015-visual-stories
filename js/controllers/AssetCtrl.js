angular.module('Assets', ['AssetService']).controller("AssetCtrl", function ($scope, $sce, assets) {


	$scope.trustHTML = function(string) {
		return $sce.trustAsHtml(string);
	};
	$scope.showPhoto = true;
	$scope.showText = true;

	$scope.getArticle = function(){
		$scope.response = null;
		assets.getData().then(function(dataResponse) {
			$scope.response = dataResponse;
			$scope.images = [];
			$scope.slideshow = [];
			$scope.article = $scope.response.data;
			createItems($scope.article, $scope);
		})
	};
});

function createItems(data, $scope){
	$scope.elements = [
		{	"name": "headline",
			"text": $scope.article.headline = data.result.headline,},
		{	"name": "summary",
			"text": $scope.article.summary = data.result.summary,},
		{	"name": "section",
			"text": $scope.article.section = data.result.section.display_name,},
		{	"name": "author",
			"text": $scope.article.author = data.result.authors[0].title_case_name,},
		{	"name": "byline",
			"text": $scope.article.byline = data.result.byline,},
		{	"name": "date",
			"text": $scope.article.date = data.result.publication_iso_date,},
		{	"name": "kicker",
			"text": $scope.article.kicker = data.result.kicker,},
		{	"name": "link",
			"text": $scope.article.link = data.result.url}
	];
	$scope.article.Top = data.result.regions.Top.modules[0].modules,
	$scope.article.Embedded = data.result.regions.Embedded.modules[0].modules,
	getImages($scope.article.Top, $scope),
	getImages($scope.article.Embedded, $scope)
}

function getImages(section, $scope) {
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
