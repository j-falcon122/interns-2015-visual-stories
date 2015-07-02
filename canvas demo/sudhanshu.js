var fs = require('fs');
var article;
fs.readFile('./articles/article0.json', 'utf-8', function(err, data){
	if(!err) {
		article = JSON.parse(data);
		// console.log(JSON.parse(article));
		paragraph = article.result.article.body;
		//work goes here. Parse the article for the important quotes
	} else {
		console.log("Could not read file...")
	}
});




