var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var port 			= process.env.PORT || 8080;
var router 			= express.Router();

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
	})

	.get(function(req, res){
		raw = raw || 'none'
		res.json({ message: raw })
	});

// http://localhost:8080/api
router.get('/',function(req, res) {
	res.json({ message: 'API is workin!'});
});

app.use('/api', router);
app.listen(port);
console.log('hosting on port ' + port);

/*

app.post('/api/data', function(req, res){
	var user_name=req.body.user;
	var password=req.body.password;
	console.log("User name = "+user_name+", password is "+password);
	res.end("yes");
});

$.post("http://localhost:3000/login",{user: user,password: pass}, function(data){
	if(data==='done'){
		alert("login  success");
	}
});
 */