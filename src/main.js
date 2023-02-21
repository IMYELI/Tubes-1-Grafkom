var shapes = {
  lines: [],
};

var webglUtil = new webglUtils();
var canvas = document.querySelector("#canvas");
var gl = canvas.getContext("webgl");

// To check if we already clicked the canvas during a drawing mode
var clickedModes = {
  line: { click: false, hover: false },
  select: false,
};

// Storing temporary line
var tempLine = null;

var shapeIdx = -1;
var shapeCode = -1;
var currentPoint = -1;

async function main() {
  if (!gl) {
    window.alert("Error initializing WebGL");
    return;
  }

  var program = await webglUtil.createDefaultProgram(gl);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getAttribLocation(program, "a_color");
  var vertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // enabling the attribute so that we can take data from the buffer
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorUniformLocation);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(colorUniformLocation, 4, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  drawScene();

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

    // Setting the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    try {
      shapes.lines.forEach((l) => {
        l.draw(gl);
      });
    } catch (e) {
      console.log(e.message);
    }
    window.requestAnimationFrame(drawScene);
  }
}

main();

function generateLine() {
  shapes.lines.push(new line(gl, [randInt(300), randInt(300), randInt(300), randInt(300)], [Math.random(), Math.random(), Math.random(), Math.random()]));

  console.log(shapes.lines);
}

// Generate an integer from 0 to (range-1)
function randInt(range) {
  return Math.floor(Math.random() * range);
}

// What to do with canvas while clicking the line button
function lineDrawingMode() {
  canvas.onmousedown = (e) => {
    lineDrawClick(e);
  };
  canvas.onmousemove = (e) => {
    lineDrawHover(e);
  };
}

// What to do if the canvas is clicked during lineDrawingMode
function lineDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.line.click) {
    tempLine = new line(gl, coord, [Math.random(), Math.random(), Math.random(), Math.random()]);
    clickedModes.line.click = true;
  } else {
    clickedModes.line.click = false;
    clickedModes.line.hover = false;
  }
}

// What to do if the canvas is hovered after clicked during lineDrawingMode
function lineDrawHover(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (clickedModes.line.click && clickedModes.line.hover) {
    shapes.lines[shapes.lines.length - 1].changeLastCoord(coord);
  } else if (clickedModes.line.click && !clickedModes.line.hover) {
    tempLine.firstHoverCoord(coord);
    shapes.lines.push(tempLine);
    clickedModes.line.hover = true;
  }
}

// using select tool to modify points
function selectMode() {
  canvas.onmousedown = (e) => {
    selectClick(e);
  };
  canvas.onmousemove = (e) => {
    selectHover(e);
  };
}

function selectClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.select) {
    // Check lines first
    for (var i = 0; i < shapes.lines.length; i++) {
      var l = shapes.lines[i];
      var selectStatus = l.isEndpoint(coord);
      if (selectStatus.isEndpoint) {
        shapeIdx = i;
        clickedModes.select = true;
        shapeCode = 1;
        currentPoint = selectStatus.point;
        break;
      }
    }
  } else {
    shapeIdx = -1;
    shapeCode = -1;
    currentPoint = -1;
    clickedModes.select = false;
  }
}

function selectHover(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (shapeCode == 1 && clickedModes.select) {
    shapes.lines[shapeIdx].setVertexCoord(coord, currentPoint);
  }
}
