var ffmpeg = require('fluent-ffmpeg');

var proc = ffmpeg('tmp/%d.jpg')
  .size('400x400')
  // using 25 fps
  .fps(25)
  // setup event handlers
  .on('end', function() {
	      console.log('file has been converted succesfully');
  })
  .on('error', function(err) {
	      console.log('an error happened: ' + err.message);
  })
  // save to file
  .save('output.m4v');
