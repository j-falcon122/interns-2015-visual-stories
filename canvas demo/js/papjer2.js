
var canvas = document.getElementById('myCanvas');
var tool = new paper.Tool();
paper.setup(canvas);


function imageSize(raster) {
    if (raster.width > raster.height) {
        var ratio = (paper.view.size._width) / raster.width;
        raster.position = new paper.Point(raster.width * ratio / 2, paper.view.size._height / 2);
        raster.scale(ratio);

    } else {
        var ratio = (paper.view.size._height) / raster.height;
        raster.position = new paper.Point(paper.view.size._width / 2, raster.height * ratio/2);
        raster.scale(ratio);
    }
    return raster;
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

// cached_frames.push({frame : saveCanvas.toDataURL("image/png"), number : count});
// sendFrames();





