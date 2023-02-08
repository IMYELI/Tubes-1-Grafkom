async function main() {
  var webglUtil = new webglUtils();
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    window.alert("Error initializing WebGL");
    return;
  }

  var program = await webglUtil.createDefaultProgram(gl);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  drawScene();

  generateRectangle(2);
  generateLine(5);

  // Generate an integer from 0 to (range-1)
  function randInt(range) {
    return Math.floor(Math.random() * range);
  }

  //Buffering the points of rectangle.
  function bufferRectangle(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
  }

  // Setting the color of object
  function bufferRandomColor(opacity = 1) {
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), opacity);
  }

  function generateLine(count = 1) {
    var primitiveType = gl.LINES;
    var offset = 0;
    var shaderCount = 2;

    for (var i = 0; i < count; i++) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([randInt(300), randInt(300), randInt(300), randInt(300)]), gl.STATIC_DRAW);
      bufferRandomColor();
      gl.drawArrays(primitiveType, offset, shaderCount);
    }
  }

  // Create <count> rectangle
  function generateRectangle(count = 1) {
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var shaderCount = 6;
    for (var i = 0; i < count; i++) {
      bufferRectangle(randInt(300), randInt(300), randInt(300), randInt(300));
      bufferRandomColor();
      gl.drawArrays(primitiveType, offset, shaderCount);
    }
  }

  function drawScene() {
    webglUtil.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Using the default program
    gl.useProgram(program);

    // enabling the attribute so that we can take data from the buffer
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Setting the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  }
}

main();
