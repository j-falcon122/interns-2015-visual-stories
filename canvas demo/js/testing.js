var content = $("#content");
var images = [];
var article;
var Top

$.getJSON( "../articles/article1.json", function(data) {
	article = data;
	var headline = data.result.headline;
	var summary = data.result.summary;
	var author = data.result.authors[0].title_case_name;
	var date = data.result.publication_iso_date;
	Top = data.result.regions.Top.modules[0].modules;
	var Embedded = data.result.regions.Embedded.modules[0].modules;

	content.append(headline + "<br>");
	content.append(author + "<br>");
	content.append(date + "<br>");
	content.append(summary + "<br><br>");

	getImages(Top);
	getImages(Embedded);

	images.forEach(function(pic, it){
		content.append("<img src='" + pic.url + "'><br><p>"+ pic.credit + "</p>");
	})
	console.log(images.length)

});

function getImages(section){
	$.each(section, function(id){
		if(typeof(section[id].image) !== "undefined"){
			if(section[id].display_size !== "SMALL"){
				images.push({
					"credit": section[id].image.credit,
					"url": section[id].image.image_crops.articleLarge.url
				});
			}
		}
	});
}
