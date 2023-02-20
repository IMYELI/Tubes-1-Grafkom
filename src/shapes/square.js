class square extends shape {
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

      let length = Math.min(
        Math.abs(coord[0] - this.coord[0]),
        Math.abs(coord[1] - this.coord[1])
      );

      if (coord[0] > this.coord[0] && coord[1] > this.coord[1]) {
        this.coord.push(
          this.coord[0], this.coord[1] + length,
          this.coord[0] + length, this.coord[1] + length,
          this.coord[0] + length, this.coord[1]
        );
      } else if (coord[0] < this.coord[0] && coord[1] < this.coord[1]) {
        this.coord.push(
          this.coord[0], this.coord[1] - length,
          this.coord[0] - length, this.coord[1] - length,
          this.coord[0] - length, this.coord[1]
        );
      } else if (coord[0] > this.coord[0] && coord[1] < this.coord[1]) {
        this.coord.push(
          this.coord[0], this.coord[1] - length,
          this.coord[0] + length, this.coord[1] - length,
          this.coord[0] + length, this.coord[1]
        );
      } else {
        this.coord.push(
          this.coord[0], this.coord[1] + length,
          this.coord[0] - length, this.coord[1] + length,
          this.coord[0] - length, this.coord[1]
        );
      }
    }

}