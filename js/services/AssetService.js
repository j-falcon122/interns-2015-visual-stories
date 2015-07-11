angular.module('AssetService', []).factory("assets", ['$http', function($http){

  function getMetadata(article) {
    return [
      { "name": "headline",
        "text": article.result.headline},
      { "name": "summary",
        "text": article.result.summary},
      { "name": "section",
        "text": article.result.section.display_name},
      { "name": "author",
        "text": article.result.authors[0].title_case_name},
      { "name": "byline",
        "text": article.result.byline},
      { "name": "date",
        "text": article.result.publication_iso_date},
      { "name": "kicker",
        "text": article.result.kicker},
      { "name": "link",
        "text": article.result.url}
    ];
  }

  function getImages(section) {
    var images = [];
    _.each(section, function(asset, id) {

      if (asset.image && asset.display_size !== "SMALL"){
        images.push({
          type: 'single',
          url: asset.image.image_crops.articleLarge.url,
          credit: asset.image.credit,
          caption: asset.image.caption.full
        });
      }

      if (asset.imageslideshow) {
        asset.imageslideshow.slides.forEach(function(slide){
          images.push({
            type: 'slide',
            url: slide.image_crops.articleLarge.url,
            credit: slide.credit,
            caption: removePTags(decodeHtml(slide.caption.full))
          });
        });
      }

    });

    return images;
  }

  function decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
  }

  function removePTags(html){
    return html.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
  }

  function getQuotes(body) {
    console.log(body);
    var parsedNoP = removePTags(body);
    var sentences = parsedNoP.split( ". ");

    var linesStartingWithQuotes = [];
    for (var i = 0; i < sentences.length; i++){
      var line = sentences[i];

      if (line.charAt(0) == '“') {
        var substring = line.substring(1,line.indexOf("”"));
        if (substring.length != 1) {
          if (substring.charAt(substring.length-1) != ',') {
            linesStartingWithQuotes.push(substring);
          }
        }
      }
    }

    return linesStartingWithQuotes;
  }

	var getData = function() {
		return $http({
			method: 'GET',
    	url: '/assets/articles/article0.json'
		}).then(function(response) {
      var quotes = getQuotes(response.data.result.article.body);

      var topImages = response.data.result.regions.Top.modules[0].modules;
      var embeddedImages = response.data.result.regions.Embedded.modules[0].modules;
      var images = getImages(topImages);
      images = images.concat(getImages(embeddedImages));

      var metadata = getMetadata(response.data);
      return {
        quotes: quotes,
        images: images,
        metadata: metadata
      };
    });
	}
	return {getData: getData};
}]);
