class line extends shape {
  constructor(gl, coord, color) {
    super(gl.LINES, 0, 2, color, coord);
  }

  changeLastCoord(coord) {
    this.vertex.pop();
    this.vertex.pop();
    this.vertex.pop();
    this.vertex.pop();
    this.vertex.pop();
    this.vertex.pop();
    this.vertex.push(coord[0]);
    this.vertex.push(coord[1]);

    this.vertex.push(this.baseColor[0]);
    this.vertex.push(this.baseColor[1]);
    this.vertex.push(this.baseColor[2]);
    this.vertex.push(this.baseColor[3]);
  }

  firstHoverCoord(coord) {
    this.vertex.push(coord[0]);
    this.vertex.push(coord[1]);
    this.vertex.push(this.baseColor[0]);
    this.vertex.push(this.baseColor[1]);
    this.vertex.push(this.baseColor[2]);
    this.vertex.push(this.baseColor[3]);
  }

  isEndpoint(coord) {
    var error = 4;
    var retVal = { isEndpoint: false, point: -1 };

    if (this.vertex[0] - error <= coord[0] && coord[0] <= this.vertex[0] + error && this.vertex[1] - error <= coord[1] && coord[1] <= this.vertex[1] + error) {
      retVal.isEndpoint = true;
      retVal.point = 0;
    }
    if (this.vertex[6] - error <= coord[0] && coord[0] <= this.vertex[6] + error && this.vertex[7] - error <= coord[1] && coord[1] <= this.vertex[7] + error) {
      retVal.isEndpoint = true;
      retVal.point = 1;
    }
    console.log(retVal);
    return retVal;
  }
}
