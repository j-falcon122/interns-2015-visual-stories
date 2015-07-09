var loadData = angular.module ('timesTrailer', []);
loadData.controller ("importData", function ($scope, $sce, $http) {
	$scope.trustHTML = function(string) {
		return $sce.trustAsHtml(string);
	};
	$scope.showPhoto = true;
	$scope.showText = true;

	loadXMLDoc(function(data){
		$scope.images = [];
		$scope.slideshow = [];
		$scope.article = JSON.parse(data);
		createItems($scope.article, $scope);
		console.log($scope.article.result.headline);
		$scope.$apply();
	});

	//editor stuff
	$scope.autoPositions = [
        {value:null, label:'none'},
        {value:"tb", label:'top banner'},
        {value:"tli", label:'top left inset'},
        {value:"tri", label:'top right inset'},
        {value:"cb", label:'centered banner'},
        {value:"bli", label:'bottom left inset'},
        {value:"bri", label:'bottom right inset'},
        {value:"bb", label:'bottom banner'}
	];
	$scope.overlay = {
		enabled : true,
		autoPosition: $scope.autoPositions[0],
		opacity: 0.8,
		overlayColor: '#000000',
		manualPosition: [0, 0, 0, 0]
	};


	$scope.fonts = ['NYTCheltenhamBdCon', 'NYTCheltenhamBdXCon', 'NYTCheltenhamBold', 'NYTCheltenhamBook', 'NYTCheltenhamExtBd', 'NYTCheltenhamExtLt', 'NYTCheltenhamLt', 'NYTCheltenhamLtCon', 'NYTCheltenhamLtSC', 'NYTCheltenhamMedCon', 'NYTCheltenhamMedium', 'NYTCheltenhamWide', 'NYTFranklinBold', 'NYTFranklinExtraBd', 'NYTFranklinHeadline', 'NYTFranklinLight', 'NYTFranklinMedium', 'NYTFranklinSemiBold', 'NYTImperial', 'NYTImperialSemiBold', 'NYTKarnakDisplay', 'NYTKarnakText', 'NYTStymieLight', 'NYTStymieMedium']
	$scope.text = {
		content: '',
		color: '#ffffff',
		size: 24,
		font: $scope.fonts[0]
	};



});

function loadXMLDoc(callback) {
	var req = new XMLHttpRequest();
		req.onload = function() {
			console.log("loaded");
			callback(req.response);
		}
	req.open("GET", "/assets/articles/article0.json", true);
	req.send();
}

function createItems(data, $scope){
	// to add more variables, add it to the variables.txt and run files.js
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

