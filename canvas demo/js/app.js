/*
Todo:
Designs for slides
API calls
Functions to decide slides
*/

(function(){
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
			// from article: << http://local.sbx.nytimes.com/2015/06/22/fashion/mens-style/in-milan-the-mens-fashion-crowd-practices-magazine-diplomacy.html >>
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
		//	winky face
		var teaser = new PointText({
			point: view.center,
			justification: 'center',
			fontSize: 50,
			fillColor: '#FFFFFF',
			content: "Click here ;)",
			fontFamily: "Comic Sans"
		})

		//	obama image
		var image = new Raster("photo");
		var ratio = (view.size._width)/image.width;
		image.position = new Point(image.width*ratio/2, image.height*ratio/2)
		image.scale(ratio);

		//	headline
		var text1 = new PointText({
			point: new Point(10, image.height*ratio + 50),
			justification: 'left',
			fontSize: 35,
			fillColor: '#FFFFFF',
			content: headline,
			fontFamily: "Times New Roman"
		});

		//	author and date
		var text2 = new PointText({
			point: new Point(10,460),
			justification: 'left',
			fontSize: 20,
			fillColor: '#FFFFFF',
			content: author + "\n" + date,
			fontFamily: "Times New Roman"
		});
	}

	if(tests.fontTest){
		var nyt = new PointText({
			point: new Point(view.size._width/2,100),
			justification: 'center',
			fontSize: 35,
			fillColor: "#FFFFFF",
			content: "NYTKarnakDisplay",
			fontFamily: "NYTKarnakDisplay"
		})

		var times = new PointText({
			point: new Point(view.size._width/2,200),
			justification: 'center',
			fontSize: 35,
			fillColor: "#FFFFFF",
			content: "NYTCheltenhamLt",
			fontFamily: "NYTCheltenhamLt"
		})
	}

	if(tests.styles){
		var photos = [];
		results.article2.photo.forEach(function(photo, it){
			console.log(it + " " + photo);
			photo[it] = imageSize(new Raster('results.article2.photo['+it+']'));
		});
	}

	function imageSize(raster){
		if(raster.width > raster.height){
			var ratio = (view.size._width)/raster.width;
			raster.position = new Point(raster.width*ratio/2, raster.height*ratio/2);
			raster.scale(ratio);
		} else {
			var ratio = (view.size._height)/raster.height;
			raster.position = new Point(view.size._width/2, raster.height*ratio/2);
			raster.scale(ratio);
		}
	}

	//	clicking interface
	var mouse = false;
	var count = 0;
	function onMouseDown(event){
		mouse = true;
	}
	function onMouseUp(event){
		mouse = false;
		count = 0;
	}

	//	onFrame refreshes 60 times a second
	//	You can use the event "event.count" as a counter,
	//	or manually make a counter
	function onFrame(event){
		if(tests.articleTop){
			if(mouse){
				count += 1
				image.opacity = (count/90)
				text1.opacity = (count/120)
				text2.opacity = (count/150)
				teaser.opacity = 1 - (count/90)
			} else {
				teaser.opacity = 1;
				image.opacity = 0;
				text1.opacity = 0;
				text2.opacity = 0;
			}
		}
	}
})();
