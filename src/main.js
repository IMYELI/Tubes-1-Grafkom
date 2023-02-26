var shapes = {
  lines: [],
  squares: [],
  rectangles: [],
  polygons: [],
  selectedPoints: [],
};

var webglUtil = new webglUtils();
var canvas = document.querySelector("#canvas");
var gl = canvas.getContext("webgl");
var polygonPoints = document.querySelector("#polygon-sides");
var slider = document.getElementById("dilation");
var colorSelector = document.getElementById("color-picker");

var inputModel = document.getElementById("load-file")

// To check if we already clicked the canvas during a drawing mode
var clickedModes = {
  line: { click: false, hover: false },
  square: { click: false, hover: false },
  rectangle: { click: false, hover: false },
  polygon: { click: false },
  rotate: { click: false, hover: false },
  translate: { click: false, hover: false },
  movePoint: { click: false, hover: false },
  dilate: { click: false, hover: false },
  bucketFill: { click: false, hover: false },
};

// Storing temporary line
var tempLine = null;
var tempSquare = null;
var tempRectangle = null;
var selectedShape = null;
var middlePoints = null;
var baseCoord = null;
var baseDistance

var shapeIdx = -1;
var shapeCode = -1;
var currentPoint = -1;

async function main() {
  if (!gl) {
    window.alert("Error initializing WebGL");
    return;
  }
  inputModel.onchange = e => { 
    shapes = {
      lines: [],
      squares: [],
      rectangles: [],
      polygons: [],
      selectedPoints: [],
    }
    var file = e.target.files[0]; 
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    reader.onload = readerEvent => {
      var content = readerEvent.target.result;
      var tempShapes = JSON.parse(content);

      //Create lines
      var i = 0;
      tempShapes.lines.forEach((l) => {
        shapes.lines.push(new line(gl, [l.vertex[0], l.vertex[1]], [l.vertex[2],l.vertex[3],  l.vertex[4], l.vertex[5]]));
        for(let n = 1;n<2;n++){
          shapes.lines[i].pushVertex([l.vertex[n*6],l.vertex[n*6+1]], [l.vertex[n*6+2],l.vertex[n*6+3],l.vertex[n*6+4],l.vertex[n*6+5]]);
        }
        i++
      });

      //Create squares
      i = 0;
      tempShapes.squares.forEach((s) => {
        shapes.squares.push(new square(gl, [s.vertex[0], s.vertex[1]], [s.vertex[2],s.vertex[3],  s.vertex[4], s.vertex[5]]));
        console.log(shapes.squares[0])
        for(let n = 1;n<4;n++){
          shapes.squares[i].pushVertex([s.vertex[n*6],s.vertex[n*6+1]], [s.vertex[n*6+2],s.vertex[n*6+3],s.vertex[n*6+4],s.vertex[n*6+5]]);
        }
        i++
      });

      //Create rectangles
      i = 0;
      tempShapes.rectangles.forEach((r) => {
        shapes.rectangles.push(new rectangle(gl, [r.vertex[0], r.vertex[1]], [r.vertex[2],r.vertex[3],  r.vertex[4], r.vertex[5]]));
        for(let n = 1;n<4;n++){
          shapes.rectangles[i].pushVertex([r.vertex[n*6],r.vertex[n*6+1]], [r.vertex[n*6+2],r.vertex[n*6+3],r.vertex[n*6+4],r.vertex[n*6+5]]);
        }
        i++;
      });

      //Create polygons
      i = 0;
      tempShapes.polygons.forEach((p) => {
        shapes.polygons.push(new polygon(gl, [p.vertex[0], p.vertex[1]], [p.vertex[2],p.vertex[3],  p.vertex[4], p.vertex[5]]));
        for(let n = 1;n<p.vertex.length/6;n++){
          shapes.polygons[i].pushVertex([p.vertex[n*6],p.vertex[n*6+1]], [p.vertex[n*6+2],p.vertex[n*6+3],p.vertex[n*6+4],p.vertex[n*6+5]]);
          shapes.polygons[i].shaderCount++;
        }
        i++;
      });
    
    }
  }

  slider.addEventListener("input", function () {
    if(shapeCode != -1) {
      let scale = slider.value;
      shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].dilate(baseCoord, scale, middlePoints);
    }
  });

  slider.addEventListener("mouseup",function(e){
    if(shapeCode != -1){
      refreshSelectedPoint();
      baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
      middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
    }
  })

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
      shapes.squares.forEach((s) => {
        s.draw(gl);
      });
      shapes.rectangles.forEach((r) => {
        r.draw(gl);
      });
      shapes.polygons.forEach((p) => {
        p.draw(gl);
      });
      shapes.selectedPoints.forEach((p) => {
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

  // using select tool to modify points
  function selectMode() {
    canvas.onmousedown = (e) => {
      selectClick(e);
    };
    canvas.onmousemove = (e) => {
      // selectHover(e);
    };
  }



  function selectClick(e) {
    var coord = webglUtil.getCanvasCoord(e);
      shapeIdx = -1;
      shapeCode = -1;
      currentPoint = -1;
      shapes.selectedPoints = [];
      // Check lines first
      for (var i = 0; i < shapes.lines.length; i++) {
        var l = shapes.lines[i];
        var selectStatus = l.isInside(coord);
        if (selectStatus) {
          console.log("Line " + i + " is selected");
          shapeIdx = i;
          clickedModes.select = true;
          shapeCode = 1;
          break;
        }
      }

      // Check squares
      for (var i = 0; i < shapes.squares.length; i++) {
        var s = shapes.squares[i];
        var selectStatus = s.isInside(coord);
        if (selectStatus) {
          console.log("Square " + i + " is selected");
          shapeIdx = i;
          clickedModes.select = true;
          shapeCode = 2;
          break;
        }
      }

      // Check rectangles
      for (var i = 0; i < shapes.rectangles.length; i++) {
        var r = shapes.rectangles[i];
        var selectStatus = r.isInside(coord);
        if (selectStatus) {
          console.log("Rectangle " + i + " is selected");
          shapeIdx = i;
          clickedModes.select = true;
          shapeCode = 3;
          break;
        }
      }

      // Check polygons
      for (var i = 0; i < shapes.polygons.length; i++) {
        var p = shapes.polygons[i];
        var selectStatus = p.isInside(coord);
        if (selectStatus) {
          console.log("Polygon " + i + " is selected");
          shapeIdx = i;
          clickedModes.select = true;
          shapeCode = 4;
          // currentPoint = selectStatus.point;
          break;
        }
      }
      
      //Adding selectedPoint
      if(shapeCode != -1){
      refreshSelectedPoint();
      baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
      middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle();
    }

  }

  function selectHover(e) {
    var coord = webglUtil.getCanvasCoord(e);
    if (shapeCode == 1 && clickedModes.select) {
      shapes.lines[shapeIdx].setVertexCoord(coord, currentPoint);
    }else if (shapeCode == 2 && clickedModes.select) {
      shapes.squares[shapeIdx].setVertexCoord(coord, currentPoint);
    } else if (shapeCode == 3 && clickedModes.select) {
      shapes.rectangles[shapeIdx].setVertexCoord(coord, currentPoint);
    } else if (shapeCode == 4 && clickedModes.select) {
      shapes.polygons[shapeIdx].setVertexCoord(coord, currentPoint);
    }
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
    var color = webglUtil.hexToRgba(document.getElementById("color-picker").value);
    tempLine = new line(gl, coord, color);
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
    // Update the last line
    shapes.lines[shapes.lines.length - 1].setVertexCoord(coord, 1);
  } else if (clickedModes.line.click && !clickedModes.line.hover) {
    // Add a new point in line on the first click
    tempLine.pushVertex(coord);
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
    var color = webglUtil.hexToRgba(document.getElementById("color-picker").value);
    tempSquare = new square(gl, coord, color);
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
    var color = webglUtil.hexToRgba(document.getElementById("color-picker").value);
    tempRectangle = new rectangle(gl, coord, color);
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
  canvas.onmousemove = (e) => {
    //do nothing
  }
  canvas.onmouseleave = (e) => {
    clickedModes.polygon.click = false;
  }
}

function polygonDrawClick(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if (!clickedModes.polygon.click) {
    var color = webglUtil.hexToRgba(document.getElementById("color-picker").value);
    tempPolygon = new polygon(gl, coord, color);
    clickedModes.polygon.click = true;
  } else if (clickedModes.polygon.click && e.button == 0) {
    if (tempPolygon.getPointCount() == 2) {
      tempPolygon.addCoord(coord);
      shapes.polygons.push(tempPolygon);
    } else if (tempPolygon.getPointCount() == 1) {
      tempPolygon.addCoord(coord);
    } else {
      shapes.polygons[shapes.polygons.length - 1].addCoord(coord);
    }
  } else if (clickedModes.polygon.click && e.button == 2) {
    if (tempPolygon.getPointCount() == 2) {
      tempPolygon.addCoord(coord);
      shapes.polygons.push(tempPolygon);
    } else if (tempPolygon.getPointCount() > 2) {
      shapes.polygons[shapes.polygons.length - 1].addCoord(coord);
    }
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
  canvas.onmouseleave = (e) => {
    clickedModes.polygon.click = false;
  };
}

function polygonAdd(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if(shapeCode == 4){
    shapes.polygons[shapeIdx].addCoord(coord);
    refreshSelectedPoint();
    baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
    middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
  }
}

function polygonRemovePoint() {
  canvas.onmousedown = (e) => {
    polygonRemove(e);
  };
  canvas.onmousemove = (e) => {
    // do nothing
  };
  canvas.onmouseleave = (e) => {
    // do nothing
  };
}

function polygonRemove(e) {
  var coord = webglUtil.getCanvasCoord(e);
  if(shapeCode == 4){
    var point = shapes.polygons[shapeIdx].isNearVertex(coord);
    if(point != -1){
      shapes.polygons[shapeIdx].removeCoord(point);
      refreshSelectedPoint();
      baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
      middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
    }
  }
}

function deleteObject(){
  if(shapeIdx != -1){
    shapes[Object.keys(shapes)[shapeCode-1]].splice(shapeIdx, 1);
    shapeIdx = -1;
    shapeCode = -1;
    refreshSelectedPoint();
  }
}

function clearCanvas(){
  shapes = {
    lines: [],
    squares: [],
    rectangles: [],
    polygons: [],
    selectedPoints: [],
  }
  
  shapeIdx = -1;
  shapeCode = -1;
  refreshSelectedPoint();
}

function translateMode(){
  canvas.onmousedown = (e) => {
    startTranslate(e);
  };
  canvas.onmousemove = (e) => {
    translateObject(e);
  };
  canvas.onmouseleave = (e) => {
    // do nothing
  };
}

function startTranslate(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(shapeIdx != -1 && !clickedModes.translate.click){
    clickedModes.translate.click = true;
    baseDistance = [coord[0] - middlePoints[0], coord[1] - middlePoints[1]];
  }else if(shapeIdx != -1){
    clickedModes.translate.click = false;
    refreshSelectedPoint();
    baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
    middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
  }
}

function translateObject(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(clickedModes.translate.click && shapeCode != 0){
    shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].translate(coord, baseDistance);
  }
}

function rotateMode(){
  canvas.onmousedown = (e) => {
    startRotate();
  };
  canvas.onmousemove = (e) => {
    rotateObject(e);
  };
  canvas.onmouseleave = (e) => {
    clickedModes.rotate.click = false;
  };
}

function refreshSelectedPoint(){
  shapes.selectedPoints = [];
  if(shapeIdx != -1){
    var count = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getPointCount()
      for(var i = 0; i < count; i++){
        shapes.selectedPoints.push(new point(gl,shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getVertexCoord(i),[1,0,0,1]));
      }
  }
}

function rotateObject(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(clickedModes.rotate.click && shapeCode != -1){
    shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].rotate(baseCoord, coord, middlePoints);
  }
}

function startRotate(){
  if(shapeIdx != -1){
    if(!clickedModes.rotate.click){
      clickedModes.rotate.click = true
    }else{
      clickedModes.rotate.click = false
      refreshSelectedPoint();
      baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
      middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
    }
  }
}

function movePointMode(){
  canvas.onmousedown = (e) => {
    selectPoint(e);
  };
  canvas.onmousemove = (e) => {
    movePointObject(e);
  };
  canvas.onmouseleave = (e) => {
    // do nothing
  };
}

function saveModel(){
  var json = JSON.stringify(shapes);
  var blob = new Blob([json], {type: "application/json"});
  var url  = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.download    = "model.json";
  a.href        = url;
  a.textContent = "Download model.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


function selectPoint(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(!clickedModes.movePoint.click && shapeCode != -1){
    var countPoint = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getPointCount();
    for(var i = 0; i < countPoint; i++){
      var status = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].isPoint(coord);
      if(status.isEndpoint){
        currentPoint = status.point;
        clickedModes.movePoint.click = true;
        break;
      }
    }
  }else{
    shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].movePoint(currentPoint, coord)
    refreshSelectedPoint();
    baseCoord = [...shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].vertex];
    middlePoints = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getMiddle()
    clickedModes.movePoint.click = false;
  }
}

function movePointObject(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(clickedModes.movePoint.click){
    shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].movePoint(currentPoint, coord);
  }
}

function bucketMode(){
  canvas.onmousedown = (e) => {
    bucketFill(e);
  };
  canvas.onmousemove = (e) => {
    // do nothing
  };
  canvas.onmouseleave = (e) => {
    // do nothing
  };
}

function bucketFill(e){
  var coord = webglUtil.getCanvasCoord(e);
  if(shapeCode != -1){
    var countPoint = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].getPointCount();
    for(var i = 0; i < countPoint; i++){
      var status = shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].isPoint(coord);
      if(status.isEndpoint){
        var color = webglUtil.hexToRgba(colorSelector.value)
        currentPoint = status.point;
        shapes[Object.keys(shapes)[shapeCode-1]][shapeIdx].setVertexColor(currentPoint, color);
        break;
      }
    }
  }
}
