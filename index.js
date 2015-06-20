var ffmpeg = require('fluent-ffmpeg');

var proc = ffmpeg('tmp/%d.png')
  .videoCodec('libx264')
  .outputOptions(['-pix_fmt yuv420p'])
  // setup event handlers
  .on('end', function() {
	      console.log('file has been converted succesfully');
  })
  .on('error', function(err) {
	      console.log('an error happened: ' + err.message);
  })
  // save to file
  .save('output.mp4');
