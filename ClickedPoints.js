// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  var size = gl.getAttribLocation(gl.program, 'size');
  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position,	u_FragColor,	size); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // The array for the position of a mouse press
var g_size = [];
var g_colours = [];
function click(ev, gl, canvas, a_Position, u_FragColor, size) {
	
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // Store the coordinates to g_points array
  g_points.push(x); g_points.push(y);
  
  //Push random colour to stack (everytime a point clicked --> different colour)
  g_colours.push(Math.random(),Math.random(),Math.random(),1.0);

  g_size.push((Math.random()*50));

  // Clear <canvas>
 
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  var index=0;
  var ptsizeloc=0;
  for(var i = 0; i < len; i += 2){
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
	
    //Passes the point colour to u_FragColor variable
    gl.uniform4f(u_FragColor, g_colours[index],g_colours[index+1],g_colours[index+2],g_colours[index+3]);
	index +=4;
	
	// Pass the point size to a 
	gl.vertexAttrib1f(size,g_size[ptsizeloc]);
	ptsizeloc++;
	
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
