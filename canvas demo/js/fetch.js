var http = require('http');
var fs = require('fs');

var file = fs.createWriteStream("test.jpg");
var request = http.get("http://static01.nyt.com/images/2015/06/30/nyregion/30MANHUNT3/30MANHUNT3-square640.jpg", function(response) {
  response.pipe(file);
  console.log('done');
});


