var canvas;
var width = 512;
var height = 288;

function initialize() {
    canvas = new fabric.Canvas('canvas');
}

function getRectangle(type, spec_width, spec_height) {
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

    dimensions[2] = spec_width ? spec_width : dimensions[2];
    dimensions[3] = spec_height ? spec_height : dimensions[3];
    return dimensions;
}

function drawAll() {
    var positionType = $('#position').val();
    var spec_width = parseInt($('#width').val());
    var spec_height = parseInt($('#height').val());

    var rect;
    if (positionType) {
        rect = getRectangle(positionType, spec_width, spec_height);
    }

    if ($('#overlay').is(':checked')) {
        createOverlay(rect);
    }

    createText($('#text-content').val(), rect);
}

function createOverlay(rect) {
    var rectangle = new fabric.Rect({
        left: rect[0],
        top: rect[1],
        width: rect[2],
        height: rect[3],
        fill: 'red',
    });
    canvas.add(rectangle);

    // wrapText(ctx, text, positions[0], positions[1], positions[2], positions[3]/2);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function save() {
    window.location = canvas.toDataURL();
}

$(document).ready(function() {
    initialize();
});