// Things to look into
// sending photos linked in website
// speeding up speed of data -> canvas
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    var tool = new paper.Tool();
    paper.setup(canvas);

    var tests = {
        articleTop: false,
        fontTest : false,
        styles: true,
        preprocess: false
    };

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
            var ratio = (paper.view.size._width) / raster.width;
            raster.position = new paper.Point(raster.width * ratio / 2, paper.view.size._height / 2);

            if (tests.articleTop) {
                raster.position = new Point(raster.width * ratio / 2, raster.height * ratio / 2);
            }

            raster.scale(ratio);
        } else {
            var ratio = (paper.view.size._height) / raster.height;
            raster.position = new paper.Point(paper.view.size._width / 2, raster.height * ratio/2);
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

    function fadeIn(object, ticks) {
        ticks = ticks || 60;

        object.opacity += (1 / ticks);

        if (object.opacity > 1) {
            object.opacity = 1;
        }
    }

    function fadeOut(object, ticks){
        ticks = ticks || 60;

        if (object.opacity <= 0) return;

        object.opacity -= (1 / ticks);
        if (object.opacity < 0) hide(object);
    }

    function slideOut(object, ticks) {
        ticks = ticks || 60;
        object.position -= (new paper.Point(1,0) * paper.view.size / ticks);
    }

    function createText(options) {
        return new paper.PointText(_.defaults(options, {
                point: new paper.Point(paper.view.size._width/2,100),
                justification: 'center',
                fontSize: 35,
                fillColor: "#FFFFFF",
                content: "no text specified",
                fontFamily: "NYTCheltenhamBold",
                opacity : 1
        }));
    }

    function sendFrames(){
        console.log('sendFrames');
        $.ajax({
            url: '/api/data',
            method: 'POST',
            data: {frames : cached_frames},
            success: function(res){
                console.log(res);
            }
        });

        cached_frames = [];
    }

    function finish() {
        $.ajax({
            method: 'GET',
            url : '/api/done',
            success : function(res) {
                console.log(res);
            }
        });
    }

    var nyt, times;

    function reset() {
        images = [];
        descriptions = [];

        //draw background
        var path = new paper.Path.Rectangle(new paper.Point(0,0), new paper.Size(paper.paper.view.size)).fillColor = "#000000";


        teaser = new paper.Raster('logo');
        teaser.opacity = 1;
        imageSize(teaser);
        teaser.scale(0.5);

        results.article2.photo.forEach(function(photo, it) {
            images[it] = new paper.Raster('results.article2.photo[' + it +']');
            imageSize(images[it]);
        });
        hide(images);

        results.article2.photo_tagline.forEach(function(photo, it){
            descriptions[it] = createText({
                point: new paper.Point(paper.view.size._width/2,490),
                fontSize: 15,
                content: results.article2.photo_tagline[it],
                fontFamily: "NYTCheltenhamLtSC",
                opacity:0
            });
        });

        directions = createText({
            point: new paper.Point(paper.view.size._width / 2, 490),
            justification: 'center',
            fontSize: 15,
            content: "Hold down to watch trailer",
            fontFamily: "NYTCheltenhamLtSC",
        });

        if (tests.articleTop) {

            image = new paper.Raster("photo");
            imageSize(image);
            hide(image);

            //  headline
            text1 = createText({
                point: new paper.Point(10, 375),
                justification: 'left',
                content: results.article1.headline,
                fontFamily: "NYTCheltenhamBold italic",
                opacity: 0
            });

            //  author and date
            text2 = createText({
                point: new paper.Point(10,460),
                justification: 'left',
                fontSize: 20,
                content: results.article1.author + "\n" + results.article1.date,
                fontFamily: "Times New Roman",
                opacity: 0
            });
        }

        if (tests.fontTest) {
            nyt = createText({
                content: "italic",
                fontFamily: "NYTCheltenhamBold",
                fontStyle: "italic"
            });

            times = createText({
                point: new paper.Point(paper.view.size._width/2,200),
                content: "normal",
                fontFamily: "NYTCheltenhamBold"
            });
        }
    }

    tool.onMouseDown = function(event) {
        mouse = true;
    }

    tool.onMouseUp = function(event) {
        mouse = false;
    }

    paper.paper.view.onFrame = function(event) {
        if (!mouse) return;

        if(tests.styles){
            hide(directions);
            fadeOut(teaser, 15);
        }


        if (tests.styles) {
            onFrameDefault(event);
        }

        if (tests.articleTop) {
            fadeIn(image);
            fadeIn(text1);
            fadeIn(text2);
        }

        if (tests.fontTest) {
            count++;
            fadeIn(nyt);
            fadeIn(times);
            cached_frames.push({frame : canvas.toDataURL("image/png"), number : count});
            if (count % 3 === 0) {
                sendFrames();
            }
        }
    }

    function onFrameDefault(event) {

        var shouldPlay = iterator < images.length - 1;

        if (!shouldPlay) return;

        count += shouldPlay ? TICK_TIME : 0;

        if (count % 240 < 30) {
            fadeIn(images[iterator], 30);
            fadeIn(descriptions[iterator], 30);
        }

        if (count % 240 > 120) {
            slideOut(images[iterator], 60);
            hide(descriptions[iterator]);
        }

        if (count % 240 > 180) {
            fadeIn(images[iterator + 1], 90);
        }

        // cached_frames.push({frame : finalCanvas.toDataURL("image/png"), number : count});
        console.log(finalCanvas.toDataURL("image/png"));
        if (count % num_frames_in_package === 0) {
            // sendFrames();
        }

        if (count % 240 === 0) {
            iterator += 1;
        }
    }

    var TICK_TIME = 1;
    var num_frames_in_package = 3;
    var cached_frames = [];

    var mouse = false;
    var count = 1;
    var iterator = 0;
    var images = [];
    var descriptions = [];
    var directions;
    var image, text1, text2, teaser;
    var finalCanvas = $('#myCanvas')[0];


    if (tests.preprocess) {
        $.getJSON( "../articles/article1.json", function(data) {
            var testing = data;
            // console.log(testing)
        })
    }

    //initial page load:
    if (tests.styles){
        reset();
    }
}
