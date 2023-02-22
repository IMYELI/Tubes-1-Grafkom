class polygon extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 1, color, coord);
  }

  addCoord(coord) {
    this.pushVertex(coord);
    this.shaderCount++;
  }

  removeCoord(index) {
    this.vertex.splice(index, 2);
    this.shaderCount--;
  }

  movePoint(coord, index) {
    this.vertex[index] = coord[0];
    this.vertex[index + 1] = coord[1];
  }

  isInside(coord) {
    let x = coord[0];
    let y = coord[1];
    let n = this.getPointCount();
    let inside = false;
    for (let i = 0; i < n; i += 2) {
      let x1 = this.vertex[i],
        y1 = this.vertex[i + 1];
      let x2 = this.vertex[(i + 2) % n],
        y2 = this.vertex[(i + 3) % n];

      let intersect = y1 > y != y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  getMiddle() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.vertex.length; i += 2) {
      x += this.vertex[i];
      y += this.vertex[i + 1];
    }
    return [x / (this.vertex.length / 2), y / (this.vertex.length / 2)];
  }

  translate(coord) {
    let middle = this.getMiddle();
    let x = coord[0] - middle[0];
    let y = coord[1] - middle[1];
    for (let i = 0; i < this.vertex.length; i += 2) {
      this.vertex[i] += x;
      this.vertex[i + 1] += y;
    }
  }

  dilate(coordObject, scale, middle) {
    for (let i = 0; i < this.vertex.length; i += 2) {
      this.vertex[i] = middle[0] + (coordObject[i] - middle[0]) * scale;
      this.vertex[i + 1] = middle[1] + (coordObject[i + 1] - middle[1]) * scale;
    }
  }
  rotate(coordObject, coord, middle) {
    let angle = Math.atan2(coord[1] - middle[1], coord[0] - middle[0]);
    angle = (angle + 2 * Math.PI) % (2 * Math.PI);
    for (let i = 0; i < coordObject.length; i += 2) {
      let x = coordObject[i] - middle[0];
      let y = coordObject[i + 1] - middle[1];
      this.vertex[i] = middle[0] + x * Math.cos(angle) - y * Math.sin(angle);
      this.vertex[i + 1] = middle[1] + x * Math.sin(angle) + y * Math.cos(angle);
    }
  }

  isNearVertex(coord) {
    for (let i = 0; i < this.vertex.length; i += 2) {
      if (Math.abs(this.vertex[i] - coord[0]) < 5 && Math.abs(this.vertex[i + 1] - coord[1]) < 5) {
        return i;
      }
    }
    return -1;
  }
}
