class line extends shape {
  constructor(gl, coord, color) {
    super(gl.LINES, 0, 2, color, coord);
  }

  changeLastCoord(coord) {
    this.coord.pop();
    this.coord.pop();
    this.coord.push(coord[0]);
    this.coord.push(coord[1]);
  }

  firstHoverCoord(coord) {
    this.coord.push(coord[0]);
    this.coord.push(coord[1]);
  }
}
