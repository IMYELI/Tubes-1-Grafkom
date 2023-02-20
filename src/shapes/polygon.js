class polygon extends shape {
  constructor(gl, coord, color) {
      super(gl.TRIANGLE_FAN, 0, 1, color, coord);
  }

  addCoord(coord) {
      this.coord.push(coord[0]);
      this.coord.push(coord[1]);
      this.shaderCount++;
  }
}