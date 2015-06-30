var http = require('http');
var fs = require('fs');

var file = fs.createWriteStream("test.jpg");
var request = http.get("http://static01.nyt.com/images/2015/06/29/nyregion/29MANHUNTsubber/29MANHUNTsubber-square640-v3.jpg", function(response) {
  response.pipe(file);
  console.log('done');
});

