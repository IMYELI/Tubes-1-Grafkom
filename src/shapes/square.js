class square extends shape {
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

      let length = Math.min(
        Math.abs(coord[0] - this.vertex[0]),
        Math.abs(coord[1] - this.vertex[1])
      );

      if (coord[0] > this.vertex[0] && coord[1] > this.vertex[1]) {
        this.pushVertex([this.vertex[0], this.vertex[1] + length]);
        this.pushVertex([this.vertex[0] + length, this.vertex[1] + length]);
        this.pushVertex([this.vertex[0] + length, this.vertex[1]]);
        
      } else if (coord[0] < this.vertex[0] && coord[1] < this.vertex[1]) {
        this.pushVertex([this.vertex[0], this.vertex[1] - length]);
        this.pushVertex([this.vertex[0] - length, this.vertex[1] - length]);
        this.pushVertex([this.vertex[0] - length, this.vertex[1]]);
      } else if (coord[0] > this.vertex[0] && coord[1] < this.vertex[1]) {
        this.pushVertex([this.vertex[0], this.vertex[1] - length]);
        this.pushVertex([this.vertex[0] + length, this.vertex[1] - length]);
        this.pushVertex([this.vertex[0] + length, this.vertex[1]]);
      } else {
        this.pushVertex([this.vertex[0], this.vertex[1] + length]);
        this.pushVertex([this.vertex[0] - length, this.vertex[1] + length]);
        this.pushVertex([this.vertex[0] - length, this.vertex[1]]);
      }
    }

}