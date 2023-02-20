class rectangle extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 4, color, coord);
  }

  changeLastCoord(coord) {
    for (let i = 0; i < 6; i++) {
      this.coord.pop();
    }
    this.firstHoverCoord(coord);
  }

  firstHoverCoord(coord) {
    this.coord.push(
      this.coord[0], coord[1],
      coord[0], coord[1],
      coord[0], this.coord[1]
    );
  }
}