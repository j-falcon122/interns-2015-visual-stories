var fs = require('fs');
var css = "";
/*
css += "-------------FONTS-------------\n"

fs.readdirSync('../fonts').forEach(function(name){
	css += "@font-face { \n\tfont-family: '" + name +"';\n\tsrc: url('./fonts/"+name+"')\n}\n"
})

css += "-------------CSS-------------\n"
fs.readdirSync('../fonts').forEach(function(name, it){
	css += "#loadfonts p:nth-child("+(it+1)+"){font-family: '"+name+"';}\n";
})

css += "-------------HTML-------------\n"
fs.readdirSync('../fonts').forEach(function(name){
	css += "<p>"+name+"</p>\n"
})
*/
var result;
var names = [];

fs.readFile('./variables.txt', 'utf-8', function(err, data){
	var p = /\$scope\.article\.([^\s]+)/g;
	while (m = p.exec(data)){
		console.log(m[1]);
		names.push(m[1]);
	}
	data = data.split('\n');
	for(var i = 0; i < names.length; i++){
		result += "{"
		result += '\t"name": '+ '"' + names[i] +'"' + ",\n"
		result += '\t"text": '+ data[i] + ","
		result += "},\n"
	}
	fs.writeFile('files.txt', result, function(err){
		if (!err) {
			console.log("saved!");
		}
	})
});


