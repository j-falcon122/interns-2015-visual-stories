var fs = require('fs');
// first frame of test

exports.toPNG = function(string, number, cb){
	var regex = /^data:.+\/(.+);base64,(.*)$/;
	var matches = string.match(regex);
	var ext = matches[1];
	var data = matches[2];
	var buffer = new Buffer(data, 'base64');
	fs.writeFileSync('./frames/'+number+'.'+ext,buffer);
	cb();
}

