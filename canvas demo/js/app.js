/*
Todo:
Designs for slides
API calls
Functions to decide slides
*/

var tests = {
	"articleTop": false,
	"fontTest": false,
	"styles": true
}

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
}

var path = new Path.Rectangle(new Point(0,0), new Size(view.size)).fillColor = "#000000";


if(tests.articleTop){

	var teaser = new Raster('logo');
	imageSize(teaser);
	teaser.scale(0.5);
	var image = new Raster("photo");
	imageSize(image);


	//	headline
	var text1 = new PointText({
		point: new Point(10, 375),
		justification: 'left',
		fontSize: 35,
		fillColor: '#FFFFFF',
		content: results.article1.headline,
		fontFamily: "NYTCheltenhamBold italic"
	});

	//	author and date
	var text2 = new PointText({
		point: new Point(10,460),
		justification: 'left',
		fontSize: 20,
		fillColor: '#FFFFFF',
		content: results.article1.author + "\n" + results.article1.date,
		fontFamily: "Times New Roman"
	});
}

if(tests.fontTest){
	var nyt = new PointText({
		point: new Point(view.size._width/2,100),
		justification: 'center',
		fontSize: 35,
		fillColor: "#FFFFFF",
		content: "italic",
		fontFamily: "NYTCheltenhamBold",
		fontStyle: "italic"
	})

	var times = new PointText({
		point: new Point(view.size._width/2,200),
		justification: 'center',
		fontSize: 35,
		fillColor: "#FFFFFF",
		content: "normal",
		fontFamily: "NYTCheltenhamBold"
	})
}

if(tests.styles){
	var images = [];
	results.article2.photo.forEach(function(photo, it){
		images[it] = new Raster('results.article2.photo['+it+']');
		imageSize(images[it]);
	});

	var text = new Path.Rectangle(new Point(0,465), new Size(view.size)).fillColor = "#FFFFFF";	
	var descriptions = [];
	results.article2.photo_tagline.forEach(function(photo, it){
		descriptions[it] = new PointText({
			point: new Point(view.size._width/2,490),
			justification: 'center',
			fontSize: 20,
			fillColor: '#666666',
			content: results.article2.photo_tagline[it],
			fontFamily: "NYTCheltenhamLtSC",
			opacity:0
		});
	});
}

function imageSize(raster){
	if(raster.width > raster.height){
		var ratio = (view.size._width)/raster.width;
		// raster.position = new Point(raster.width*ratio/2, raster.height*ratio/2);
		raster.position = new Point(raster.width*ratio/2, view.size._height/2);
		raster.scale(ratio);
	} else {
		var ratio = (view.size._height)/raster.height;
		raster.position = new Point(view.size._width/2, raster.height*ratio/2);
		raster.scale(ratio);
	};
}

function fadeIn(object, ticks, end){
	if (typeof ticks === "undefined") {ticks = 60;};
	if (typeof end === "undefined") {end = 60};
	if(count < end){
		object.opacity = ((count)/ticks);
		if (object.opacity > 1) {
			object.opacity = 1;
		};
	};
};

function slideOut(object, ticks, end){
	if (typeof ticks === "undefined") {ticks = 120;};
	if (typeof end === "undefined") {end = 120};
	var destination = new Point(0-object.position._x,object.position._y);

	if(count < end){
		object.opacity = 1;
		object.position -= (new Point(1,0)*view.size/ticks);
	} else {
		imageSize(object);
		object.opacity = 0;
	}
};

//	clicking interface
var mouse = false;
var count = 0;
var watchdog = 0;
var iterator = 0;

function onMouseDown(event){
	mouse = true;
};

function onMouseUp(event){
	mouse = false;
	count = 0;
	watchdog = 0;
	iterator = 0;
};

//	onFrame refreshes 60 times a second
//	You can use the event "event.count" as a counter,
//	or manually make a counter
function onFrame(event){
	if(tests.articleTop){
		if(mouse){
			watchdog += 1;
			count += 1;
			image.opacity = (count/90);
			text1.opacity = (count/120);
			text2.opacity = (count/150);
			teaser.opacity = 1 - (count/30);
			if(teaser.opacity < 0){
				teaser.opacity = 0;
			}
		} else {
			teaser.opacity = 1;
			image.opacity = 0;
			text1.opacity = 0;
			text2.opacity = 0;
		}
	}
	if(tests.styles){
		if(mouse){
			watchdog += 1;
			count += 1;
			if(count % 120 === 0){
				count = 0;
			}
			if(watchdog % 240 === 0) {
				watchdog = 0
				iterator += 1;
				descriptions.forEach(function(photo){
					photo.opacity = 0;
				})
			}
			if (watchdog <= 120) {
				fadeIn(images[iterator],100,120);
				fadeIn(descriptions[iterator],30,120);
			}
			if (watchdog > 120 && watchdog <= 240){
				descriptions[iterator].opacity=1;
				slideOut(images[iterator],120,120);
			}
		} else {
			images.forEach(function(photo){
				photo.opacity = 0;
			})
			descriptions.forEach(function(thing){
				thing.opacity = 0;
			})
		}
	}
}
