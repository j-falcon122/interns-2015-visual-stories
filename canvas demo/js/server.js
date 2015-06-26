var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var port 			= process.env.PORT || 8080;
var router 			= express.Router();
var ffmpeg 			= require('fluent-ffmpeg');


//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	console.log('call was made!');
	next();
})

var raw;

router.route('/data')
	.post(function(req, res){
		raw = req.body.name;
		res.json({ message: 'received'})
		console.log("raw ", raw);
	});

	.get(function(req, res){
		raw = raw || 'none'
		res.json({ message: raw })
	});

router.route('/done')
	.get(function(req, res) {
		var proc = ffmpeg('tmp/%d.png')
		  .videoCodec('libx264')
		  .outputOptions(['-pix_fmt yuv420p'])
		  // setup event handlers
		  .on('end', function() {
			      req.json({message : 'file has been converted succesfully'});
		  })
		  .on('error', function(err) {
			      req.json(message : 'failed conversion.');
		  })
		  // save to file
		  .save('output.mp4');
	});

// http://localhost:8080/api
router.get('/',function(req, res) {
	res.json({ message: 'API is workin!'});
});

app.use('/api', router);
app.listen(port);
console.log('hosting on port ' + port);
