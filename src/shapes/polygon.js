class polygon extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 1, color, coord);
  }

  addCoord(coord) {
    this.coord.push(coord[0]);
    this.coord.push(coord[1]);
    this.shaderCount++;
  }

  // check if the point (coord[0], coord[1]) is inside the polygon

  isInside(coord) {
    let x = coord[0];
    let y = coord[1];
    let n = this.coord.length;
    let inside = false;
    for (let i = 0; i < n; i += 2) {
      let x1 = this.coord[i], y1 = this.coord[i + 1];
      let x2 = this.coord[(i+2) % n], y2 = this.coord[(i+3) % n];

      let intersect = ((y1 > y) != (y2 > y))
          && (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  getMiddle() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.coord.length; i += 2) {
      x += this.coord[i];
      y += this.coord[i + 1];
    }
    return [x / (this.coord.length / 2), y / (this.coord.length / 2)];
  }

  translate(coord) {
    let middle = this.getMiddle();
    let x = coord[0] - middle[0];
    let y = coord[1] - middle[1];
    for (let i = 0; i < this.coord.length; i += 2) {
      this.coord[i] += x;
      this.coord[i + 1] += y;
    }
  }

  dilate(scale) {
    let middle = this.getMiddle();
    for (let i = 0; i < this.coord.length; i += 2) {
      this.coord[i] = middle[0] + (this.coord[i] - middle[0]) * scale;
      this.coord[i + 1] = middle[1] + (this.coord[i + 1] - middle[1]) * scale;
    }
  }

  rotate(angle) {
    let middle = this.getMiddle();
    for (let i = 0; i < this.coord.length; i += 2) {
      let x = this.coord[i] - middle[0];
      let y = this.coord[i + 1] - middle[1];
      this.coord[i] = middle[0] + x * Math.cos(angle) - y * Math.sin(angle);
      this.coord[i + 1] = middle[1] + x * Math.sin(angle) + y * Math.cos(angle);
    }
  }
}