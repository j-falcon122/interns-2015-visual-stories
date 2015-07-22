/*THINGS TO ADD
    Remove quote feature (preventDefault on delete key?)
    Make it easier to create rectangles
    Work on timeline interface
    Get Ken Burns working!

*/

angular.module('Canvas', ['AssetService', 'ConfigService', 'TimelineService']).controller('CanvasCtrl', function($scope, Config, assets, timeline) {

    $scope.canvas = null;
    $scope.canvas_width = 1000;
    $scope.canvas_height = 400;
    $scope.video = null;
    $scope.showCanvas = true;

    $scope.initialize = function() {
        $scope.canvas = new fabric.Canvas('canvas', {
            backgroundColor: '#000000'
        });
        $scope.video = new Whammy.Video(15);
        getAnimationFrames();
        $scope.getParams();
    };

    $scope.getParams = function(){
        var regex = /(\?|\&)([^=]+)\=([^&]+)/;
        var params = (regex.exec($(window.location).attr("search")));
        if (!params) {
            return;
        }
        params.forEach(function(data, it){
            if (data === "article") {
                Config.settings.article = params[it+1];
            }
        })
    }

    $scope.chooseImage = function(id) {
        var img = new fabric.Image(id);
        var ratioX = $scope.canvas.width / img.width;
        var ratioY = $scope.canvas.height / img.height;
        var ratio = ratioX > ratioY ? ratioX : ratioY;
        img.set({
            selectable: false,
            scaleX: ratio,
            scaleY: ratio

        });
        $scope.canvas.add(img);
        img.sendToBack();
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
    $scope.continueRender = true;
    // $scope.getPercentage = function(){
    //     return Math.floor(($scope.progress/$scope.end_time)*100);
    // }

    $scope.addFrame = function() {
        $scope.progress++;
        $scope.video.add($scope.canvas.getContext("2d"),60);
        // if($scope.progress / $scope.end_time < 1){
        if($scope.continueRender) {
            requestAnimationFrame($scope.addFrame);
        } else {
            requestAnimationFrame($scope.finalizeVideo);
        }
    }

    $scope.finalizeVideo = function() {
        $scope.stop
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
        var saved = $scope.canvas.toJSON();
        saved =  JSON.stringify(saved);
        return saved;
    };

    $scope.loadSlide = function(data){
        $scope.canvas.loadFromJSON(data, $scope.canvas.renderAll.bind($scope.canvas));
    };

    $scope.createSlides = function() {
        assets.getData().then(function(data) {
            data.images.forEach(function(image, it){
                $scope.clearCanvas();
                $scope.chooseImage("image"+it);
                var data = {};
                data.thumb = image.url;
                $scope.setDefaults(data);
                data.title = "image"+it;
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

            // Keep this to set video duration:
            $scope.setDuration();
        });
    }

    $scope.setDefaults = function(item){
        item.duration = Config.settings.duration;
        item.enable = true;
        item.drag = true;
        item.fadeOut = Config.settings.fadeOut;
        item.fadeIn = Config.settings.fadeIn;
        item.fadeFlag = true;
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

    $scope.playSlides = function(recording) {
        $scope.continueRender = true;
        $scope.currentSlide = 0;
        var changeSlide = function() {
            var current = timeline.slides[$scope.currentSlide];
            if ($scope.currentSlide < timeline.slides.length) {
                $scope.loadSlide(current.json);
                if(current.fadeOut){
                    setTimeout(fadeSlide, (current.duration - Config.settings.fadeTime));
                } else {
                    setTimeout(changeSlide, current.duration);
                }
                $scope.currentSlide++;
            }
            else{
                $scope.continueRender = false;
            }
        };

        var fadeSlide = function() {
            // $scope.panning();
            if ($scope.currentSlide < timeline.slides.length + 1){
                $scope.fade(true);
                setTimeout(changeSlide, Config.settings.fadeTime)
            }
        }

        console.log("Length = " + (timeline.videoDuration()*50/1000 + " seconds"));
        if (recording) {
            console.log("Recording...");
            $scope.addFrame();
        } else {
            console.log("Not recording...");
        }
        changeSlide();
    }

    $scope.fade = function(out, duration) {
        duration = duration || Config.settings.fadeTime;

        _.each($scope.canvas._objects, function(obj) {
            obj.animate('opacity', out ? 0 : 100, {
                onChange: $scope.canvas.renderAll.bind($scope.canvas),
                duration: duration,
                from: out ? obj.opacity : 0
            });
        });
    }
    $scope.panning = function(){
        var duration = Config.settings.duration;

        _.each($scope.canvas._objects, function(obj) {
            obj.animate('left', -60, {
                duration: 1000,
                onChange: $scope.canvas.renderAll.bind($scope.canvas),
                // easing: fabric.util.ease.easeOutElastic
            });
        });
    }

    /***************************
    **    Video Player Time   **
    ***************************/
    // cover = good
    // poster = also good
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
