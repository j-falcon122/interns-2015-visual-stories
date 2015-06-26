var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');

var port 			= process.env.PORT || 8080;
var router 			= express.Router();
var ffmpeg 			= require('fluent-ffmpeg');
var parser 			= require('./js/parser.js');


//middleware
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname+'/'));

router.route('/data')
	.post(function(req, res){
		req.body.frames.forEach(function(data,it){
			parser.toPNG(data.frame,data.number,function(){
				console.log("working on frame: " + data.number);
			});
		});
		res.json({ message: 'received'});
	})
	.get(function(req, res){
		res.json({ message: 'hello' });
	});


router.route('/done')
	.get(function(req, res) {
		var proc = ffmpeg('frames/%d.png')
		  .videoCodec('libx264')
		  .outputOptions(['-pix_fmt yuv420p'])
		  // setup event handlers
		  .on('end', function() {
			      res.json({message : 'file has been converted succesfully'});
		  })
		  .on('error', function(err) {
			      res.json({message : 'failed conversion.'});
		  })
		  // save to file
		  .save('exported_video/output.mp4');
	});

// http://localhost:8080/api
router.get('/',function(req, res) {
	res.json({ message: 'API is workin!'});
});

app.use('/api', router);
app.listen(port);
console.log('hosting on port ' + port);
