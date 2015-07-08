canvas = $('#canvas2')[0];
// console.log(canvas.toDataURL());
console.log(canvas.width)

var ctx = canvas.getContext('2d');
ctx.textAlign = 'center';
ctx.textBaseline = "top";
ctx.font = "italic bold 32pt";
ctx.fillStyle = "#333";
ctx.fillText("hello there", canvas.width/2, canvas.height/2);
// while (!fontsLoaded) {
//     console.log('mmwahahaha');
// }
// window.location = canvas.toDataURL();
