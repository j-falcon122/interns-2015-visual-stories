var content = $("#content");
var images = [];
var slideshow = [];
var article;

$.getJSON( "../articles/article0.json", function(data) {
	article = data;
	console.log(article)
	var headline = data.result.headline;
	var summary = data.result.summary;
	var section = data.result.section.display_name;
	var author = data.result.authors[0].title_case_name;
	var byline = data.result.byline
	var date = data.result.publication_iso_date;
	var kicker = data.result.kicker;
	var Top = data.result.regions.Top.modules[0].modules;
	var Embedded = data.result.regions.Embedded.modules[0].modules;

	getImages(Top);
	getImages(Embedded);

	images.forEach(function(pic, it){
		content.append("<img src='" + pic.url + "'><p>" + pic.caption +"</p><p>" + pic.credit + "</p>");
	})
	slideshow.forEach(function(pic, it){
		content.append("<img src='" + pic.url + "'><p>" + pic.caption +"</p><p>" + pic.credit + "</p>");
	})
});

function addItem(object, type, options){
	content.append("<div class='element'>");
	if (type === 'photo') {
		content.append("<img src='" + object.url + "'><p>" + object.caption +"</p><p>" + object.credit + "</p>");
	}
}
// finds images that are not small
function getImages(section){
	$.each(section, function(id){

		if(typeof(section[id].image) !== "undefined"){
			if(section[id].display_size !== "SMALL"){
				console.log(id + " " + section[id].data_type)
				images.push({
					"url": section[id].image.image_crops.articleLarge.url,
					"credit": section[id].image.credit,
					"caption": section[id].image.caption.full
				});
			}
		}
		if(typeof(section[id].imageslideshow) !== "undefined"){
			console.log(id + " " + section[id].data_type)
			section[id].imageslideshow.slides.forEach(function(slide){
				slideshow.push({
					"url": slide.image_crops.articleLarge.url,
					"credit": slide.credit,
					"caption": slide.caption.full
				})
			})
		}
	});
}

