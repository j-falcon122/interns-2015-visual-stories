var fs = require('fs');
var css = "";
// css += "-------------FONTS-------------\n"

fs.readdirSync('../assets/fonts').forEach(function(name){
	// css += "@font-face { \n\tfont-family: '" + name +"';\n\tsrc: url('./fonts/"+name+"')\n}\n"
	css += "<div class='font-family' onclick='selectFont(this)' style='font-family:"+name+"' value='"+name+"'>"+name+"</div>\n";
})

// css += "-------------CSS-------------\n"
// fs.readdirSync('../fonts').forEach(function(name, it){
// 	css += "#loadfonts p:nth-child("+(it+1)+"){font-family: '"+name+"';}\n";
// })

// css += "-------------HTML-------------\n"
fs.readdirSync('../assets/fonts').forEach(function(name){
	// css += "<p style='font-family:"+name+"'>"+name+"</p>\n"
})

fs.writeFile('files.txt', css, function(err){
	if (!err) {
		console.log("saved!");
	}
})
