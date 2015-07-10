var fs = require('fs');
var article;
fs.readFile('../assets/articles/article0.json', 'utf-8', function(err, data){
	if(!err) {
		parsed = JSON.parse(data);
		paragraph = parsed.result.article.body;
		var parsedNoP = paragraph.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
		var array = parsedNoP.split( ". ")

		var arrayLength = array.length;
		var linesStartingWithQuotes = new Array();
		for (var i = 0; i < array.length; i++){
			var line = array[i];
			
			if (line.charAt(0) == '“'){
				var substring = line.substring(1,line.indexOf("”"));
				if (substring.length != 1){
					if (substring.charAt(substring.length-1) != ','){
					linesStartingWithQuotes.push(substring);
				    }
			    }
			  }
		}

		console.log(parsed)
		
		// console.log(article.keys);
		//work goes here. Parse the article for the important quotes
	} else {
		console.log("Could not read the file...")
	}
});




