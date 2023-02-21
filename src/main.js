var shapes = {
  lines: [],
  squares: [],
  rectangles: [],
  polygons: [],
};

var webglUtil = new webglUtils();
var canvas = document.querySelector("#canvas");
var gl = canvas.getContext("webgl");
var polygonPoints = document.querySelector("#polygon-sides");

// To check if we already clicked the canvas during a drawing mode
var clickedModes = {
  line: { click: false, hover: false },
  square: { click: false, hover: false },
  rectangle: { click: false, hover: false },
  polygon: { click: false },
};

// Storing temporary line
var tempLine = null;
var tempSquare = null;
var tempRectangle = null;
var selectedShape = null;

async function main() {
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

    try {
      shapes.lines.forEach((l) => {
        l.setGLColor(gl, colorUniformLocation);
        l.draw(gl);
      });
      shapes.squares.forEach((s) => {
        s.setGLColor(gl, colorUniformLocation);
        s.draw(gl);
      });
      shapes.rectangles.forEach((r) => {
        r.setGLColor(gl, colorUniformLocation);
        r.draw(gl);
      });
      shapes.polygons.forEach((p) => {
        p.setGLColor(gl, colorUniformLocation);
        p.draw(gl);
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
  canvas.onmouseleave = (e) => {
    lineDrawLeave(e);
  }
}

// What to do if the canvas is clicked during lineDrawingMode
function lineDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.line.click) {
    tempLine = new line(gl, coord, [0.9, 0, 0, 1]);
    clickedModes.line.click = true;
  } else {
    shapes.lines[shapes.lines.length - 1].changeLastCoord(coord);
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

// What to do if the canvas is left after clicked during lineDrawingMode
function lineDrawLeave(e) {
  if (clickedModes.line.click && clickedModes.line.hover) {
    clickedModes.line.click = false;
    clickedModes.line.hover = false;
  }
}

function squareDrawingMode() {
  canvas.onmousedown = (e) => {
    squareDrawClick(e);
  };
  canvas.onmousemove = (e) => {
    squareDrawHover(e);
  };
  canvas.onmouseleave = (e) => {
    squareDrawLeave(e);
  };
}

function squareDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.square.click) {
    tempSquare = new square(gl, coord, [0.9, 0, 0, 1]);
    clickedModes.square.click = true;
  } else {
    shapes.squares[shapes.squares.length - 1].changeLastCoord(coord);
    clickedModes.square.click = false;
    clickedModes.square.hover = false;
  }
}

function squareDrawHover(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (clickedModes.square.click && clickedModes.square.hover) {
    shapes.squares[shapes.squares.length - 1].changeLastCoord(coord);
  } else if (clickedModes.square.click && !clickedModes.square.hover) {
    tempSquare.firstHoverCoord(coord);
    shapes.squares.push(tempSquare);
    clickedModes.square.hover = true;
  }
}

function squareDrawLeave(e) {
  if (clickedModes.square.click && clickedModes.square.hover) {
    clickedModes.square.click = false;
    clickedModes.square.hover = false;
  }
}

function rectangleDrawingMode() {
  canvas.onmousedown = (e) => {
    rectangleDrawClick(e);
  };
  canvas.onmousemove = (e) => {
    rectangleDrawHover(e);
  };
  canvas.onmouseleave = (e) => {
    rectangleDrawLeave(e);
  }
}

function rectangleDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.rectangle.click) {
    tempRectangle = new rectangle(gl, coord, [0.9, 0, 0, 1]);
    clickedModes.rectangle.click = true;
  } else {
    shapes.rectangles[shapes.rectangles.length - 1].changeLastCoord(coord);
    clickedModes.rectangle.click = false;
    clickedModes.rectangle.hover = false;
  }
}

function rectangleDrawHover(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (clickedModes.rectangle.click && clickedModes.rectangle.hover) {
    shapes.rectangles[shapes.rectangles.length - 1].changeLastCoord(coord);
  } else if (clickedModes.rectangle.click && !clickedModes.rectangle.hover) {
    tempRectangle.firstHoverCoord(coord);
    shapes.rectangles.push(tempRectangle);
    clickedModes.rectangle.hover = true;
  }
}

function rectangleDrawLeave(e) {
  if (clickedModes.rectangle.click && clickedModes.rectangle.hover) {
    clickedModes.rectangle.click = false;
    clickedModes.rectangle.hover = false;
  }
}

function polygonDrawingMode() {
  canvas.onmousedown = (e) => {
    polygonDrawClick(e);
  };
  canvas.ondblclick = (e) => {
    polygonDrawEnd(e);
  }
  canvas.onmousemove = (e) => {
    //do nothing
  }
}

function polygonDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.polygon.click) {
    tempPolygon = new polygon(gl, coord, [0.9, 0, 0, 1]);
    clickedModes.polygon.click = true;
  } else {
    tempPolygon.addCoord(coord);
  }
}

function polygonDrawEnd(e) {
  if (clickedModes.polygon.click) {
    var coord = webglUtil.getCanvasCoord(e);
    tempPolygon.addCoord(coord);
    shapes.polygons.push(tempPolygon);
    clickedModes.polygon.click = false;
  }
}

function polygonAddPoint() {
  canvas.onmousedown = (e) => {
    polygonAdd(e);
  };
  canvas.onmousemove = (e) => {
    // do nothing
  };
}

function polygonAdd(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.polygon.click) {
    for (var i = 0; i < shapes.polygons.length; i++) {
      if (shapes.polygons[i].isInside(coord)) {
        selectedShape = i;
        tempPolygon = shapes.polygons[i];
        clickedModes.polygon.click = true;
        break;
      }
    }
  } else {
    shapes.polygons.splice(selectedShape, 1);
    tempPolygon.addCoord(coord);
    shapes.polygons.push(tempPolygon);
    clickedModes.polygon.click = false;
  }
}

function polygonTranslation() {
  canvas.onmousedown = (e) => {
    console.log("click2");
    polygonPlace(e);
  };
  canvas.onmousemove = (e) => {
    polygonMove(e);
  };
  canvas.onmouseleave = (e) => {
    polygonLeave(e);
  }
}

function polygonPlace(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.polygon.click) {
    for (var i = 0; i < shapes.polygons.length; i++) {
      if (shapes.polygons[i].isInside(coord)) {
        selectedShape = i;
        clickedModes.polygon.click = true;
        break;
      }
    }
  } else {
    shapes.polygons[selectedShape].translate(coord);
    clickedModes.polygon.click = false;
  }
}

function polygonMove(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (clickedModes.polygon.click) {
    shapes.polygons[selectedShape].translate(coord);
  }
}

function polygonLeave(e) {
  if (clickedModes.polygon.click) {
    clickedModes.polygon.click = false;
  }
}

function polygonDilation() {
  canvas.onmousedown = (e) => {
    polygonDilate(e);
  };
  canvas.onmousemove = (e) => {
    // do nothing
  };
}

function polygonDilate(e) {
  var coord = webglUtil.getCanvasCoord(e);
  for (var i = 0; i < shapes.polygons.length; i++) {
    if (shapes.polygons[i].isInside(coord)) {
      selectedShape = i;
      var value = document.querySelector("#myRange").value;
      shapes.polygons[selectedShape].dilate(value);
      break;
    }
  }
}