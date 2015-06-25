results = {
	article1: {
		"source": "http://www.nytimes.com/2015/06/22/us/california-golf-trip-lands-obama-in-a-water-use-debate.html?ref=us&_r=0",
		"headline": "California Golf Trip Lands \nObama in a Water-Use Debate",
		"photo": "http://static01.nyt.com/images/2015/06/22/us/21OBAMA/21OBAMA-master675-v3.jpg",
		"photo_tagline": "President Obama at the airport in Palm Springs, Calif., on Saturday, before going to the Sunnylands estate in Rancho Mirage. Credit Zach Gibson/The New York Times",
		"date": "JUNE 21, 2015",
		"author": "By GARDINER HARRIS",
		"section": "POLITICS",
		"kicker": "WHITE HOUSE MEMO"
	},
	article2: {
		"source": "http://local.sbx.nytimes.com/2015/06/22/fashion/mens-style/in-milan-the-mens-fashion-crowd-practices-magazine-diplomacy.html",
		"headline": "In Milan, the Men’s Fashion Crowd Practices Magazine Diplomacy",
		"photo":[
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-BJB3/Scene-CITY-gq-slide-BJB3-articleLarge.jpg",
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-D4NP/Scene-CITY-gq-slide-D4NP-articleLarge.jpg",
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-82GI/Scene-CITY-gq-slide-82GI-articleLarge.jpg",
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-3N9C/Scene-CITY-gq-slide-3N9C-articleLarge.jpg",
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-0Q6E/Scene-CITY-gq-slide-0Q6E-articleLarge.jpg",
			"http://static01.nyt.com/images/2015/06/22/fashion/Scene-CITY-gq-slide-TKR8/Scene-CITY-gq-slide-TKR8-articleLarge.jpg"
		],
		"photo_tagline": [
			"Miguel performing during the GQ party for Jim Moore.",
			"Jim Nelson, right, and Jim Moore at the GQ party.",
			"Neil Barrett and Thom Browne at the GQ party.",
			"Dan Peres, right, and Tomas Maier, center at the Details party.",
			"The Details magazine party.",
			"Dan Peres, Constanza Etro and Kean Etro at the Details party."
		],
		"photographer": [
			"JACOPO RAULE / GETTY IMAGES FOR GQ",
			"JACOPO RAULE / GETTY IMAGES FOR GQ",
			"JACOPO RAULE / GETTY IMAGES FOR GQ",
			"VITTORIO ZUNINO CELOTTO / GETTY IMAGES FOR DETAILS MAGAZINE",
			"VITTORIO ZUNINO CELOTTO / GETTY IMAGES FOR DETAILS MAGAZINE",
			"VITTORIO ZUNINO CELOTTO / GETTY IMAGES FOR DETAILS MAGAZINE"
		],
		"date": "JUNE 21, 2015",
		"author": "By GARDINER HARRIS",
		"section": "POLITICS",
		"kicker": "WHITE HOUSE MEMO"
	}
};

function imageSize(raster) {
	if (raster.width > raster.height) {
		var ratio = (view.size._width) / raster.width;
		raster.position = new Point(raster.width * ratio / 2, view.size._height / 2);

		if (tests.articleTop) {
			raster.position = new Point(raster.width * ratio / 2, raster.height * ratio / 2);
		}

		raster.scale(ratio);
	} else {
		var ratio = (view.size._height) / raster.height;
		raster.position = new Point(view.size._width / 2, raster.height * ratio/2);
		raster.scale(ratio);
	}

}

function hide(images) {
	if (images instanceof Array) {
		images.forEach(function(image) {
			image.opacity = 0;
		});
	} else {
		images.opacity = 0;
	}
}

function fadeIn(object, ticks, end) {
	ticks = ticks || 60;
	end = end || 60;

	if (count >= end) return;

	if (count != 0) object.opacity = (count / ticks);
	if (object.opacity > 1) object.opacity = 1;
}

function fadeOut(object, ticks, end){
	ticks = ticks || 60;
	end = end || 60;

	if (count >= end) return;

	object.opacity = 1 - ((count)/ticks);
	if (object.opacity < 0) hide(object);
}

function slideOut(object, ticks, end) {
	ticks = ticks || 60;
	end = end || 60;
	var destination = new Point(object.position._x, object.position._y);
	if (count < end) {
		object.opacity = 1;
		object.position -= (new Point(1,0) * view.size / ticks);
	} else {
		imageSize(object);
		hide(object);
	}
}

function createText(options) {

	return new PointText(_.defaults(options, {
			point: new Point(view.size._width/2,100),
			justification: 'center',
			fontSize: 35,
			fillColor: "#FFFFFF",
			content: "no text specified",
			fontFamily: "NYTCheltenhamBold",
			opacity : 1
		}));
}

function reset() {
	images = [];
	descriptions = [];


	teaser = new Raster('logo');
	teaser.opacity = 1;
	imageSize(teaser);
	teaser.scale(0.5);

	results.article2.photo.forEach(function(photo, it) {
		images[it] = new Raster('results.article2.photo[' + it +']');
		imageSize(images[it]);
		hide(images[it]);
	});

	results.article2.photo_tagline.forEach(function(photo, it){
		descriptions[it] = createText({
			point: new Point(view.size._width/2,490),
			fontSize: 15,
			content: results.article2.photo_tagline[it],
			fontFamily: "NYTCheltenhamLtSC",
			opacity:0
		});
	});

	directions = createText({
		point: new Point(view.size._width / 2, 490),
		justification: 'center',
		fontSize: 15,
		content: "Hold down to watch trailer",
		fontFamily: "NYTCheltenhamLtSC",
	});

	if (tests.articleTop) {

		image = new Raster("photo");
		hide(image);
		imageSize(image);


		//	headline
		text1 = createText({
			point: new Point(10, 375),
			justification: 'left',
			content: results.article1.headline,
			fontFamily: "NYTCheltenhamBold italic",
			opacity: 0
		});

		//	author and date
		text2 = createText({
			point: new Point(10,460),
			justification: 'left',
			fontSize: 20,
			content: results.article1.author + "\n" + results.article1.date,
			fontFamily: "Times New Roman",
			opacity: 0
		});
	}

}

function onMouseDown(event) {
	mouse = true;
}

function onMouseUp(event) {
	mouse = false;
	count = -1;
	watchdog = 0;
	iterator = 0;
}

function onFrame(event) {
	watchdog += mouse ? 1 : 0;
	count += mouse ? 1 : 0;

	if (tests.articleTop && count > 1) {

			fadeIn(image);
			fadeIn(text1);
			fadeIn(text2);
			fadeOut(teaser, 15);
			fadeOut(directions);
	}

	if (tests.styles) {
		if (count % 120 === 0) {
			count = 0;
		}

		if (watchdog % 240 === 0) {
			watchdog = 0;
			console.log('iterator', iterator);
			iterator += 1;
			descriptions.forEach(function(photo) {
				photo.opacity = 0;
			});
		}

		if (watchdog <= 120) {
			fadeIn(images[iterator],100,120);
			fadeIn(descriptions[iterator],30,120);
		}

		if (watchdog > 120 && watchdog <= 240){
			descriptions[iterator].opacity = 1;
			slideOut(images[iterator],120,120);
		}
	}
}

var tests = {
	articleTop: true,
	fontTest : false,
	styles: false
}

var mouse = false;
var count = 0;
var watchdog = 0;
var iterator = 0;
var images = [];
var descriptions = [];
var directions;
var image, text1, text2, teaser;

var path = new Path.Rectangle(new Point(0,0), new Size(view.size)).fillColor = "#000000";

if (tests.fontTest) {

	var nyt = createText({
		content: "italic",
		fontStyle: "italic"
	});

	var times = createText();
}

//initial page load:
reset();
