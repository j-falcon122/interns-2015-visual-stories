var canvas;
var width = 600;
var height = 400;
var newBox;
var download_no = 0;
var slides = [];
var video;

function initialize() {
    canvas = new fabric.Canvas('canvas');
    canvas.on('mouse:down', dragStart);
    canvas.on('mouse:up', dragEnd);
    video = new Whammy.Video(15);
}

function addFrame() {
    video.add(canvas.getContext("2d"), 3000);
}

function finalizeVideo() {
    var start_time = +new Date;
    var output = video.compile();
    var end_time = +new Date;
    var url = webkitURL.createObjectURL(output);
    document.getElementById('awesome').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
    document.getElementById('download-link').style.display = '';
    document.getElementById('download-link').href = url;
    // document.getElementById('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";
}

function chooseImage(id) {
    canvas.clear();
    var img = new fabric.Image(id);
    img.set({
        selectable: false,
        scaleY: canvas.height / img.height,
        scaleX: canvas.width / img.width
    });
    canvas.add(img);
}

function clearCanvas(){
    canvas.clear();
}

function saveCanvas(){
    var slide = canvas.toJSON();
    console.log('saved canvas!');
    // slides.push(slide);
    console.log(canvas.toJSON());
}

function loadCanvas(){

}

function selectFont(div) {
    $('.font-family').toggleClass('active', false);
    $(div).toggleClass('active', true);
}

function dragStart(event) {
    newBox = [0,0,0,0];
    if (event.target) {
        return;
    }

    newBox[0] = canvas.getPointer(event.e).x;
    newBox[1] = canvas.getPointer(event.e).y;
}

function dragEnd(event) {
    if (event.target) {
        return;
    }

    newBox[2] = canvas.getPointer(event.e).x;
    newBox[3] = canvas.getPointer(event.e).y;

    var tmp;
    if (Math.max(newBox[0], newBox[2]) === newBox[0]) {
        tmp = newBox[0];
        newBox[0] = newBox[2];
        newBox[2] = tmp;
    }

    if (Math.max(newBox[1], newBox[3]) === newBox[1]) {
        tmp = newBox[1];
        newBox[1] = newBox[3];
        newBox[3] = tmp;
    }


    $('#manual-x').val(newBox[0]);
    $('#manual-y').val(newBox[1]);
    $('#width').val(newBox[2] - newBox[0]);
    $('#height').val(newBox[3] - newBox[1]);
}

function getRectangleManual() {
    return [
        parseInt($('#manual-x').val()),
        parseInt($('#manual-y').val()),
        parseInt($('#width').val()),
        parseInt($('#height').val())
    ];
}

function getRectangle(type) {
    var inset_margin_width = width / 20;
    var inset_margin_height = height / 10;
    var inset_width = width * .6

    var banner_height = height * .2
    var banner_inset = 0.25 * width;

    switch (type) {
        case "tb":
            dimensions = [0, 0, width, banner_height];
            break;
        case "tli":
            dimensions = [inset_margin_width, inset_margin_height, inset_width, inset_margin_height];
            break;
        case "tri":
            dimensions = [inset_margin_width * 19 - (inset_width), inset_margin_height, inset_width, inset_margin_height];
            break;
        case "cb":
            dimensions = [0, height * .4, width, banner_height];
            break;
        case "bli":
            dimensions = [inset_margin_width, height - (inset_margin_height * 2), inset_width, inset_margin_height];
            break;
        case "bri":
            dimensions = [width - inset_margin_width - inset_width, height - (inset_margin_height * 2), inset_width, inset_margin_height];
            break;
        case "bb":
            dimensions = [0, height - banner_height, width, banner_height];
            break;
    }

    return dimensions;
}

function drawAll() {
    var configs = getConfigs();
    console.log(configs);

    var rect;
    if (configs.positionType) {
        rect = getRectangle(configs.positionType);
    } else {
        rect = getRectangleManual();
        console.log(rect);
    }

    if (!_.some(rect)) {
        alert("Must at least select a top left corner for text");
        return;
    }

    if (configs.overlay) {
        canvas.add(createOverlay(rect, configs.overlay));
    }

    if (configs.text) {
        var text = createText(rect, configs.text, true);
        canvas.add(text);
    }

    $("#download-link").attr({href: canvas.toDataURL(), download:download_no + '.png'});
}

function getConfigs() {
    var configs = {};
    configs.positionType = $('#position').val();

    configs.specWidth = parseInt($('#width').val());
    configs.specHeight = parseInt($('#height').val());

    if ($('#overlay').is(':checked')) {
        configs.overlay = {
            opacity : parseFloat($('#overlay-opacity').val()),
            color : $('#overlay-color').val()
        };
    }

    var textContent = $('#text-content').val();

    if (textContent) {
        configs.text = {
            content: $('#text-content').val(),
            justify: 'center',
            color: $('#text-color').val(),
            fontFamily: $('.font-family.active').text(),
            fontSize:$('#font-size').val(),
            fontStyle: $('#font-style')
        };
    }
    return configs;
}

function createText(rect, options) {
    console.log(options);
    var text = new fabric.Text(options.content, {
        left: rect[0],
        top: rect[1],
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        fontStyle: options.fontStyle,
        originY:'top',
        originX:'left',
        fill: options.color
    });

    if (rect[2] && rect[3]) {
        return wrapCanvasText(text, canvas, rect[2], rect[3], options.justify);
    }

    return text;
}


function wrapCanvasText(t, canvas, maxW, maxH, justify) {

    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var words = t.text.split(" ");
    var formatted = '';

    // This works only with monospace fonts
    justify = justify || 'left';

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

    var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
        left: t.left,
        top: t.top,
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

function createOverlay(rect, options) {
    var rectangle = new fabric.Rect({
        left: rect[0],
        top: rect[1],
        width: rect[2],
        height: rect[3],
        fill: options.color,
        opacity: options.opacity
    });
    return rectangle;
}



function save() {
    window.location = canvas.toDataURL();
}

$(document).ready(function() {
    initialize();
});