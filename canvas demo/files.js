var fs = require('fs');
var css = "";
css += "-------------FONTS-------------\n"

fs.readdirSync('./fonts').forEach(function(name){
	css += "@font-face { \n\tfont-family: '" + name +"';\n\tsrc: url('./fonts/"+name+"')\n}\n"
})

css += "-------------CSS-------------\n"
fs.readdirSync('./fonts').forEach(function(name, it){
	css += "#loadfonts p:nth-child("+(it+1)+"){font-family: '"+name+"';font-style:italic;}\n";
})

css += "-------------HTML-------------\n"
fs.readdirSync('./fonts').forEach(function(name){
	css += "<p>"+name+"</p>\n"
})

fs.writeFile('files.txt', css, function(err){
	if (!err) {
		console.log("saved!");
	}
})
