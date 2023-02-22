class rectangle extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 4, color, coord);
  }

  changeLastCoord(coord) {
    for (let i = 0; i < 3; i++) {
      this.removeVertex(this.getPointCount() - 1);
    }
    this.firstHoverCoord(coord);
  }

  firstHoverCoord(coord) {
    this.pushVertex([this.vertex[0], coord[1]]);
    this.pushVertex([coord[0], coord[1]]);
    this.pushVertex([coord[0], this.vertex[1]]);
  }
}