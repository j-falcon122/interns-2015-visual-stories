/*THINGS TO ADD
    Remove quote feature (preventDefault on delete key?)
    Make it easier to create rectangles
    Work on timeline interface
    Get Ken Burns working!

*/
// fabric.fastCanvas = function(_super){
//   var __hasProp = {}.hasOwnProperty;
//   var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
//   return (function(_super) {
//     __extends(fastCanvas, _super);
//     function fastCanvas() {
//       this.frame;
//       fastCanvas.__super__.constructor.apply(this, arguments);
//     }
//     fastCanvas.prototype.renderAll = function() {
//       var args = arguments;
//       var that = this;
//       window.cancelAnimationFrame(this.frame);
//       this.frame = window.requestAnimationFrame(function(){
//         fastCanvas.__super__.renderAll.apply(that, args);
//       });
//     };
//     return fastCanvas;
//   })(_super || fabric.Canvas);
// };


angular.module('Canvas', ['AssetService', 'ConfigService', 'TimelineService']).controller('CanvasCtrl', function($scope, Config, assets, timeline) {

    $scope.canvas = null;
    $scope.canvas_width = 600;
    $scope.canvas_height = 400;
    $scope.video = null;
    $scope.showCanvas = true;
    // Last chosen image;
    $scope.lastChosen;

    $scope.setLastChosen = function(id){
        $scope.lastChosen = id;
    }

    $scope.initialize = function() {
        // var fastCanvas = fabric.fastCanvas(fabric.Canvas)
        $scope.canvas = new fabric.Canvas('canvas', {
            backgroundColor: '#000000'
        });
        $scope.video = new Whammy.Video(15);
        // getAnimationFrames();
    };

    $scope.chooseImage = function(id) {
        $scope.clearCanvas();
        var img = new fabric.Image(id);
        var ratioX = $scope.canvas.width / img.width;
        var ratioY = $scope.canvas.height / img.height;
        var ratio = ratioX > ratioY ? ratioX : ratioY;
        img.set({
            scaleX: ratio,
            scaleY: ratio,
        });
        $scope.setLastChosen(id);
        $scope.canvas.add(img);
    };

    $scope.chooseQuote = function(quote, options) {
        options = _.defaults(options || {}, {
            content: '“' + quote + '”',
            color: '#ffffff',
            font: 'NYTCheltenhamExtBd',
            fontStyle: 'italic',
            size: 40,
            justify: 'center',
            compensateHeightOnWrap: true
        });
        var rect = [0, $scope.canvas_height * 2 / 5, $scope.canvas_width, $scope.canvas_height * 3 / 5];
        var text = $scope.createText(rect, options);
        $scope.canvas.add(text);
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
    var getAnimationFrames = function(){
        var requestAnimationFrame =
            window.requestAnimationFrame        ||
            window.mozRequestAnimationFrame     ||
            window.webkitRequestAnimationFrame  ||
            window.msRequestAnimationFrame;

        window.requestAnimationFrame = requestAnimationFrame;
    };

    $scope.progress = 0;
    $scope.end_time = 0;
    $scope.continueRender = false;

    $scope.drawFrame = function() {
        $scope.canvas.renderAll.bind($scope.canvas)();
        if ($scope.continueRender) {
            $scope.video.add($scope.canvas.getContext("2d"),17);
        }
    }

    $scope.finalizeVideo = function() {
        var output = $scope.video.compile();
        var url = webkitURL.createObjectURL(output);
        document.getElementById('download-link').href = url;
        $scope.player = VHS.player({
            container: 'nyt-player',
            analytics: false,
            id: 123567890,
            ads: false,
            name: 'nyt-trailer',
            src: url,
            api: false,
            mode: "html5"
        });
    }

    /***************************
    **   Loading Slides       **
    ***************************/

    $scope.saveSlide = function(){
        $scope.canvas.renderAll.bind($scope.canvas);
        var saved = $scope.canvas.toJSON();
        saved =  JSON.stringify(saved);
        return saved;
    };

    $scope.loadSlide = function(indexOrData, callback){
        if (_.isNumber(indexOrData)) {
            indexOrData = timeline.slides[indexOrData].json;
        }
        $scope.canvas.loadFromJSON(indexOrData, callback ? callback : $scope.canvas.renderAll.bind($scope.canvas));
    };

    /***************************
    **  Creating Slides       **
    ***************************/
    $scope.addSlide = function(){
        var data = {};
        data.thumb = $("#"+$scope.lastChosen).attr("src");
        $scope.setDefaults(data);
        data.title = $scope.lastChosen;
        data.json = $scope.saveSlide();
        timeline.slides.push(data);
    }

    $scope.createSlides = function() {
        assets.getData().then(function(data) {
            data.images.forEach(function(image, it){
                $scope.chooseImage("image"+it);
                var data = {};
                data.thumb = image.url;
                $scope.setDefaults(data);
                data.title = $scope.lastChosen;
                data.json = $scope.saveSlide();
                timeline.slides.push(data);
            });

            // add ending image
            $scope.chooseImage("ender");
            var data = {};
            data.json = $scope.saveSlide();
            $scope.setDefaults(data);
            data.thumb = $("#ender").attr("src");
            data.fadeOut = false;
            data.duration = 1000;
            data.title = "ender";
            timeline.slides.push(data);

            $scope.clearCanvas();

            // Keep this to set video duration:
            $scope.setDuration();
        });
    }

    $scope.setDefaults = function(item){
        item.duration = Config.settings.duration;
        item.enable = true;
        item.kenBurns = 'left';
        item.drag = true;
        item.fadeOut = Config.settings.fadeOut;
        item.fadeIn = Config.settings.fadeIn;
    }

    $scope.setDuration = function(){
        $scope.end_time = timeline.videoDuration();
    }
    /***************************
    **    Animate Slide       **
    ***************************/
    /*
    Things to consider:
    fade in
    fade out
    Ken Burns effect
    Standard
    Overlapping slides?
    not affecting text on slide

    Total time = 1000
    |...............|
    Fade in = 250
    |...|
    Fade Out = 250
                |...|
    Ken Burns
    |...............|

    Object with animation settings

    */

    $scope.currentSlide = 0;

    $scope.playSlide = function(index, nextSlide) {
        var currentSlide = timeline.slides[index];
        var duration = currentSlide.duration || 1000;
        var totalTime = 0;
        var fadeTime = Config.settings.fadeTime;
        var nop = function(x, y, cb) {cb()};

        $scope.loadSlide(currentSlide.json,
            _.partial(currentSlide.fadeIn ? $scope.fade : nop, false, fadeTime,
            _.partial(currentSlide.kenBurns ? $scope.kenBurns : nop, 'left', duration,
            _.partial(currentSlide.fadeOut ? $scope.fade : nop, true, fadeTime, nextSlide))));

        totalTime += currentSlide.fadeIn ? fadeTime : 0;
        totalTime += duration;
        totalTime += currentSlide.fadeOut ? fadeTime : 0;
        return fadeTime;
    }

    $scope.playSlides = function(recording) {
        $scope.continueRender = true;
        $scope.currentSlide = -1;
        var changeSlide = function() {
            $scope.currentSlide++;
            if ($scope.currentSlide < timeline.slides.length) {
                $scope.clearCanvas();
                var slideDuration = $scope.playSlide($scope.currentSlide, changeSlide);
            } else {
                $scope.continueRender = false;
                $scope.finalizeVideo();
            }
        };

        if (recording) {
            // $scope.addFrame();
        }

        changeSlide();
    }

    $scope.fadeOut = function(duration, onComplete) {
        duration = duration || Config.settings.fadeTime;
        duration = 2000;
        var obj = $scope.canvas._objects[0];
        obj.opacity = 1;
        console.log(obj.opacity);
        obj.animate('opacity', 0, {
            onChange: $scope.drawFrame,
            duration: duration,
            onComplete: onComplete
        });
    }

    $scope.fadeIn = function(duration, onComplete) {
        duration = duration || Config.settings.fadeTime;
        duration = 2000;
        var obj = $scope.canvas._objects[0];
        obj.opacity = 0;
        obj.animate('opacity', 1, {
            onChange: $scope.drawFrame,
            duration: duration,
            onComplete: onComplete
        });
    }

    $scope.fade = function(out, duration, onComplete) {
        duration = duration || Config.settings.fadeTime;
        duration = 2000;
        if (out) {
            $scope.fadeOut(duration, onComplete);
        } else {
            $scope.fadeIn(duration, onComplete);
        }
    }

    $scope.kenBurns = function(direction, duration, onComplete) {
        console.log('ken burns');
        var obj = $scope.canvas._objects[0];
        obj.animate({'right': -100, 'scaleX':1.1, 'scaleY':1.1}, {
            duration: duration,
            onChange: $scope.drawFrame,
            onComplete: onComplete
        });
    }

    $scope.showAll = function() {
        _.each($scope.canvas._objects, function(obj) {
            obj.opacity = 100;
        });
    }

    $scope.hideAll = function() {
        _.each($scope.canvas._objects, function(obj) {
            obj.opacity = 0;
        });
    }

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
