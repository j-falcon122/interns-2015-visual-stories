var request = require('request');

request('https://en.wikipedia.org/wiki/Apple', function(error, response, body){
	if(!error && response.statusCode == 200) {
		console.log(body);
	} else {
		console.log('error!');
	}
});
