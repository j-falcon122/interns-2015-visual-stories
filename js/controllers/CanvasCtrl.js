/*
THINGS TO ADD
    Remove quote feature (preventDefault on delete key?)
    Make it easier to create rectangles
    Work on timeline interface
    Video Algorithm
    add fadeIn fadeOut times
    OG video tags
    gif export
*/

angular.module('Canvas', ['AssetService', 'ConfigService', 'TimelineService']).controller('CanvasCtrl', function($scope, Config, assets, timeline) {

    $scope.canvas = null;
    $scope.canvas_width = 600;
    $scope.canvas_height = 337.5;
    $scope.video = null;
    $scope.showCanvas = true;
    $scope.defaultSlides = [];
    $scope.continueRender = true;


    $scope.convertToGIF = function(){
        gifshot.createGIF({
            gifWidth: 600,
            gifHeight: 338,
            video: [
                $scope.link
            ],
            numFrames: 20
        }, function (obj) {
            if (!obj.error) {
                var image = obj.image, animatedImage = document.createElement('img');
                animatedImage.src = image;
                $("#finished").append(animatedImage);
            }
        });
    };

    $scope.initialize = function() {
        $scope.canvas = new fabric.Canvas('canvas', {
            backgroundColor: '#000000'
        });
        $scope.undo = [$scope.saveSlide()];
        $scope.video = new Whammy.Video(15);
    };

    $scope.qUndo = function(){
        var saved = $scope.saveSlide();
        if (saved !== $scope.undo[$scope.undo.length - 1]) {
            $scope.undo.push(saved);
        }
    };

    $scope.popUndo = function(){
        $scope.undo.pop();
        $scope.canvas.loadFromJSON($scope.undo[$scope.undo.length-1], $scope.canvas.renderAll.bind($scope.canvas));
        if ($scope.undo.length === 0) {
            $scope.canvas.clear();
            $scope.qUndo();
        }
    };

    $scope.chooseImage = function(id, ignoreUndo) {
        $scope.clearCanvas();
        var img = new fabric.Image(id);
        var ratioX = $scope.canvas.width / img.width;
        var ratioY = $scope.canvas.height / img.height;
        if (ratioX > ratioY){
            img.width = $scope.canvas.width;
            img.height = img.height * ratioX;
        } else {
            img.width = img.width * ratioY;
            img.height = $scope.canvas.height;
        }
        $scope.canvas.add(img);
        if(!ignoreUndo) $scope.qUndo();
    };

    $scope.chooseText = function(string, options, rect, ignoreUndo) {
        options = _.defaults(options || {}, {
            content: string,
            color: '#ffffff',
            font: 'NYTCheltenhamExtBd',
            fontStyle: 'italic',
            size: 40,
            justify: 'center',
            compensateHeightOnWrap: true
        });
        rect = rect || [0, $scope.canvas_height * 2 / 5, $scope.canvas_width, $scope.canvas_height * 3 / 5];
        // x y w h
        var text = $scope.createText(rect, options);
        $scope.canvas.add(text);
        if (!ignoreUndo) $scope.qUndo();
    }

    $scope.clearCanvas = function() {
        $scope.canvas.clear();
    };

    $scope.createOverlay = function(rect, options) {
        var rectangle = new fabric.Rect({
            left: rect[0],
            top: rect[1],
            width: rect[2],
            height: rect[3],
            fill: options.overlayColor,
            opacity: options.opacity || 1
        });
        return rectangle;
    };

    $scope.createText = function(rect, options) {
        var text = new fabric.Text(options.content, {
            left: rect[0],
            top: rect[1],
            opacity: 1,
            fontFamily: options.font,
            fontSize: options.size,
            fontStyle: options.fontStyle,
            originY:'top',
            originX:'left',
            fill: options.color
        });

        if (rect[2] && rect[3]) {
            var wrapOptions = {
                maxW: rect[2],
                maxH: rect[3],
                justify: options.justify,
                compensateHeightOnWrap: options.compensateHeightOnWrap
            };
            return wrapCanvasText(text, $scope.canvas, wrapOptions);
        }
        return text;
    };

    $scope.drawAll = function() {
        var configs = Config.get();
        if (!_.some(configs.position)) {
            alert("Must at least select a top left corner for text");
            return;
        }

        if (configs.overlay.enabled) {
            $scope.canvas.add($scope.createOverlay(configs.position, configs.overlay));
        }

        if (configs.text) {
            var text = $scope.createText(configs.position, configs.text);
            $scope.canvas.add(text);
        }
    };

    /***************************
    **        Video           **
    ***************************/
    $scope.addFrame = function() {
        $scope.video.add($scope.canvas.getContext("2d"),17);
        if ($scope.continueRender) {
            requestAnimationFrame($scope.addFrame);
        }
    };

    $scope.finalizeVideo = function() {
        var output = $scope.video.compile();
        var link = webkitURL.createObjectURL(output);
        if ($scope.player) {
            $scope.player.destroy();
            $('#video-container').append("<div id='nyt-player'></div>");
        }
        $('#download-link').attr('href', link);
        $scope.player = VHS.player({
            container: 'nyt-player',
            analytics: false,
            id: 123567890,
            ads: false,
            name: 'nyt-trailer',
            src: link,
            api: false,
            mode: "html5"
        });
        $scope.showCanvas = false;
        $scope.$apply();
    };

    /***************************
    **   Loading Slides       **
    ***************************/
    $scope.lastChosen = -1;

    $scope.saveSlide = function(){
        var saved = $scope.canvas.toJSON();
        saved =  JSON.stringify(saved);
        return saved;
    };

    $scope.restoreSlide = function(index){
        $scope.loadSlide(index, function() {
            $scope.canvas.renderAll();
            $scope.qUndo();
        })
        $scope.lastChosen = index;
    };


    $scope.loadSlide = function(indexOrData, callback){
        if (_.isNumber(indexOrData)) {
            indexOrData = timeline.slides[indexOrData].json;
        }
        $scope.canvas.loadFromJSONWithoutClearing(indexOrData, callback ? callback : $scope.canvas.renderAll.bind($scope.canvas));
    };

    /***************************
    **  Creating Slides       **
    ***************************/
    $scope.addSlide = function(){
        var data = Config.defaultSlide($scope.saveSlide());
        var quality = 0.5;
        data.thumb = document.getElementById("canvas").toDataURL("image/png",quality);
        if($scope.lastChosen >= 0) {
            timeline.slides[$scope.lastChosen] = data;
        } else {
            timeline.slides.push(data);
        }
        $scope.lastChosen = -1;
    };

    $scope.headlineStyle = {
        fontStyle: 'italic',
        size: 40
    };
    $scope.headlinePosition = [0, $scope.canvas_height * 2 / 5, $scope.canvas_width, $scope.canvas_height * 3 / 5];
    $scope.bylineStyle = {
        fontStyle: 'normal',
        size: 12,
        justify: 'left'
    };
    $scope.bylinePosition = [20, $scope.canvas_height * 9 / 10, $scope.canvas_width, $scope.canvas_height * 1 / 10];
    $scope.summaryStyle = {
        fontStyle: 'normal',
        size: 21
    };

    $scope.summaryPosition = [0, $scope.canvas_height * 8 / 10, 600, $scope.canvas_height * 4 / 10];
    $scope.summaryOverlay = new fabric.Rect({
        left: 0,
        top: $scope.canvas_height * 7 / 10,
        fill: "#000000",
        opacity: 0.5,
        width: 600,
        height: $scope.canvas_height * 4 / 10
    });

    $scope.createSlides = function() {
        assets.getData().then(function(loaded) {
            // staring image
            $scope.chooseImage("starter", true);
            var starter = Config.defaultSlide($scope.saveSlide());
            starter.thumb = document.getElementById("canvas").toDataURL("image/png", 0.5);
            starter.duration = 1000;
            starter.kenBurns = Config.settings.kenBurns;
            starter.panning = false;
            starter.fadeOut = true;

            $scope.defaultSlides.push({
                name: "starter",
                url: $("#starter").attr("src"),
            });
            timeline.slides.push(starter);

            $scope.headline = _.findWhere(loaded.metadata, {name: 'Headline'}).text;
            $scope.byline = _.findWhere(loaded.metadata, {name: 'Byline'}).text;
            $scope.summary = _.findWhere(loaded.metadata, {name: 'Summary'}).text;
            $scope.link = _.findWhere(loaded.metadata, {name: 'Link'}).text;

            $scope.canvas.clear();
            $scope.chooseText($scope.headline, $scope.headlineStyle, $scope.headlinePosition, true);
            $scope.chooseText($scope.byline, $scope.bylineStyle, $scope.bylinePosition, true);
            var headliner = Config.defaultSlide($scope.saveSlide());
            headliner.thumb = document.getElementById("canvas").toDataURL("image/png");
            headliner.hasFade = true;
            headliner.kenBurns = Config.settings.kenBurns;
            headliner.panning = false;
            $scope.defaultSlides.push({
                name: "headliner",
                url: document.getElementById("canvas").toDataURL("image/png"),
            });
            timeline.slides.push(headliner);

            loaded.images.forEach(function(image, it){
                if (it > 5) return;
                $scope.chooseImage("image"+it, true);
                if(it == 0 || it == 1){
                    console.log("iterator worked!");
                    $scope.canvas.add($scope.summaryOverlay);
                    $scope.chooseText($scope.summary, $scope.summaryStyle, $scope.summaryPosition, true);
                }
                var data = Config.defaultSlide($scope.saveSlide());
                data.kenBurns = it%4 + 1;
                data.thumb = document.getElementById("canvas").toDataURL("image/png",0.5);
                timeline.slides.push(data);
            });

            // add ending image
            $scope.chooseImage("ender", true);
            var ender = Config.defaultSlide($scope.saveSlide());
            ender.thumb = document.getElementById("canvas").toDataURL("image/png",0.5);
            ender.fadeOut = true;
            ender.duration = 200;
            ender.kenBurns = Config.settings.kenBurns;
            ender.panning = false;
            $scope.defaultSlides.push({
                name: "ender",
                url: $("#ender").attr("src"),
            });
            timeline.slides.push(ender);
            $scope.clearCanvas();
        });
    };

    /***************************
    **    Animate Slide       **
    ***************************/

    $scope.restart = function(){
        $scope.currentSlide = timeline.slides.length;
        $scope.canvas.clear();
    };

    $scope.currentSlide = 0;

    $scope.playSlide = function(index, nextSlide) {
        var currentSlide = timeline.slides[index];
        var nop = function(x, y, cb) {cb()};
        console.log('play slide', index);

        $scope.loadSlide(currentSlide.json,
            _.partial((currentSlide.duration ? $scope.fade : nop), false, currentSlide,
            _.partial(currentSlide.fadeOut ? $scope.fade : nop, true, currentSlide, nextSlide)));
    };

    $scope.playSlides = function(recording) {
        $scope.continueRender = true;
        $scope.currentSlide = -1;
        $scope.playing = false;

        var changeSlide = function() {
            $scope.currentSlide++;
            if ($scope.currentSlide < timeline.slides.length) {
                var slideDuration = $scope.playSlide($scope.currentSlide, changeSlide);
            } else {
                if (recording) {
                    $scope.finalizeVideo();
                }
                $scope.continueRender = false;
            }
        };

        if (recording) {
            $scope.addFrame();
        }
        changeSlide();
    };

    $scope.fade = function(out, slide, onComplete) {
        if (out) {
            $scope.fadeOut(slide, onComplete);
        } else {
            $scope.fadeIn(slide, onComplete);
        }
    };

    $scope.fadeIn = function(slide, onComplete) {
        var obj = $scope.canvas._objects[0];
        if (!obj) return;

        var animation = $scope.createAnimation(slide, obj);

        obj.animate(animation, {
            onChange: $scope.canvas.renderAll.bind($scope.canvas),
            duration: slide.duration,
            onComplete: onComplete,
        });
    };

    $scope.fadeOut = function(slide, onComplete) {
        var obj = $scope.canvas._objects[0];
        if (!obj) return;
        obj.opacity = 1;
        obj.animate('opacity', 0, {
            onChange: $scope.canvas.renderAll.bind($scope.canvas),
            duration: slide.fadeOut,
            onComplete: onComplete
        });
    };

    $scope.createAnimation = function(slide, obj) {
        var animation = {};
        if (slide.fadeIn) {
            obj.opacity = 0;
            animation['opacity'] = slide.duration / slide.fadeIn;
        }
        switch (slide.kenBurns) {
            case 1:
                // zoom in, slide to the left/down
                var scale = 0.1;
                animation['left'] = obj.getLeft() - 10;
                animation['top'] = obj.getTop() - 25;
                animation['scaleX'] = (obj.scaleX + scale);
                animation['scaleY'] = (obj.scaleY + scale);
                break;
            case 2:
                // panning left/up w/o zoom
                var scale = 0.25;
                obj.scaleX = (obj.scaleX + scale);
                obj.scaleY = (obj.scaleY + scale);
                obj.top = -75;
                obj.left = -100;
                animation['left'] = obj.getLeft()+100;
                animation['top'] = obj.getTop()+20;
                break;
            case 3:
                // zoom into center
                var scale = 0.1;
                animation['top'] = (obj.height*(obj.scaleY) - obj.height*(obj.scaleY + scale)) / 2;
                animation['left'] = (obj.width*(obj.scaleX) - obj.width*(obj.scaleX + scale)) / 2;
                animation['scaleX'] = (obj.scaleX + scale);
                animation['scaleY'] = (obj.scaleY + scale);
                break;
            case 4:
                // panning right w/o zoom
                var scale = 0.25;
                obj.scaleX = (obj.scaleX + scale);
                obj.scaleY = (obj.scaleY + scale);
                obj.top = -75;
                obj.left = 0;
                animation['left'] = -100;
                break;
            case 5:
                // zoom into center
                var scale = 0.1;
                animation['left'] = (obj.width * obj.scaleX - obj.width * (obj.scaleX + scale)) / 2;
                animation['scaleX'] = obj.scaleX + scale;
                animation['scaleY'] = obj.scaleY + scale;
                break;
            default:
                animation["scaleX"] = obj.scaleX;
                break;
        }

        return animation;
    };

});

function wrapCanvasText(t, canvas, options) {

    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var words = t.text.split(" ");
    var formatted = '';
    var maxW = options.maxW;
    var maxH = options.maxH;

    // This works only with monospace fonts
    var justify = options.justify || 'left';

    // clear newlines
    var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
    // calc line height
    var lineHeight = new fabric.Text(sansBreaks, {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize
    }).height;

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = t.fontSize + "px " + t.fontFamily;
    var currentLine = '';
    var breakLineCount = 0;

    n = 0;
    while (n < words.length) {
        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";

                    if (context.measureText(withHypeh).width >= maxW) {
                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        formatted += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
        }
        n++;
    }

    if (currentLine != '') {
        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
        currentLine = ' ' + currentLine;

        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
        currentLine = ' ' + currentLine + ' ';

        formatted += currentLine + '\n';
        breakLineCount++;
        currentLine = "";
    }

    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);

    var top = t.top;
    if (options.compensateHeightOnWrap) {
        top -= (breakLineCount - 1) * (lineHeight / 2);
    }

    var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
        left: t.left,
        top: top,
        fill: t.fill,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fontStyle: t.fontStyle,
        originX: t.originX,
        originY: t.originY,
        angle: t.angle,
    });
    return ret;
}
