var fs = require('fs');
var result = "";

//create css and HTML

result += "-------------FONTS-------------\n"

fs.readdirSync('../fonts').forEach(function(name){
	// result += "@font-face { \n\tfont-family: '" + name +"';\n\tsrc: url('./fonts/"+name+"')\n}\n"
	result += "<div class='font-family' onclick='selectFont(this) style='font-family:"+name+"' value='"+name+"'>"+name+"</div>\n"
})

fs.writeFile('files.txt', result, function(err){
	if (!err) {
		console.log("saved!");
	}
})

// result += "-------------CSS-------------\n"
// fs.readdirSync('../fonts').forEach(function(name, it){
// 	result += "#loadfonts p:nth-child("+(it+1)+"){font-family: '"+name+"';}\n";
// })

// result += "-------------HTML-------------\n"
// fs.readdirSync('../fonts').forEach(function(name){
// 	result += "<p>"+name+"</p>\n"
// })


// create objects from variables
/*var result;
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
*/

