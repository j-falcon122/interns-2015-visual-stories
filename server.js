var fs 				= require('fs');
var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var port 			= process.env.PORT || 8080;
var router 			= express.Router();
var ffmpeg 			= require('fluent-ffmpeg');
var digest 			= require('http-digest-client')('human', 'R3plicant');


// //middleware
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname+'/'));

// router.route('/data')
// 	.post(function(req, res){
// 		req.body.frames.forEach(function(data,it){
// 			parser.toPNG(data.frame,data.number,function(){
// 				console.log("working on frame: " + data.number);
// 			});
// 		});
// 		res.json({ message: 'received'});
// 	})
// 	.get(function(req, res){
// 		res.json({ message: 'hello' });
// 	});


// digest.request({
// 	host: 'http://cms-publishapi.prd.nytimes.com/v1/publish/scoop/2015/07/01/sports/the-most-dangerous-game.html',
// 	path: 'data.json',
// 	port: port,
// 	method: 'GET',
// }, function (res) {
// 	res.on('data', function(data){
// 		console.log(data.toString());
// 	});
// 	res.on('error', function(err) {
// 		console.log('did not work');
// 	});
// });

app.use('/api', router);
app.listen(port);
console.log('hosting on port ' + port);
