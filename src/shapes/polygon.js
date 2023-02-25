class polygon extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 1, color, coord);
  }

  addCoord(coord) {
    this.pushVertex(coord);
    this.shaderCount++;
  }

  removeCoord(index) {
    this.removeVertex(index);
    this.shaderCount--;
  }

  movePoint(index, coord) {
    this.vertex[index*6] = coord[0];
    this.vertex[index*6 + 1] = coord[1];
  }

  isInside(coord) {
    let x = coord[0];
    let y = coord[1];
    let n = this.getPointCount();
    let inside = false;
    for (let i = 0; i < n; i += 1) {
      let x1 = this.vertex[i*6],
        y1 = this.vertex[i*6 + 1];
      let x2 = this.vertex[((i + 1) % n) * 6],
        y2 = this.vertex[((i + 1) % n) * 6 + 1];

      let intersect = y1 > y != y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  getMiddle() {
    let x = 0;
    let y = 0;
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      x += this.vertex[i*6];
      y += this.vertex[i*6 + 1];
    }
    return [x / n, y / n];
  }

  translate(coord, baseDistance) {
    let middle = this.getMiddle();
    let x = coord[0] - middle[0];
    let y = coord[1] - middle[1];
    let newDistanceX = x - baseDistance[0];
    let newDistanceY = y - baseDistance[1];
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      this.vertex[i*6] += newDistanceX;
      this.vertex[i*6 + 1] += newDistanceY;
    }
  }

  dilate(coordObject, scale, middle) {
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      this.vertex[i*6] = middle[0] + (coordObject[i*6] - middle[0]) * scale;
      this.vertex[i*6 + 1] = middle[1] + (coordObject[i*6 + 1] - middle[1]) * scale;
    }
  }

  rotate(coordObject, coord, middle) {
    let n = this.getPointCount();
    let angle = this.getAngle(coord, middle);
    for (let i = 0; i < n; i += 1) {
      let x = coordObject[i*6] - middle[0];
      let y = coordObject[i*6 + 1] - middle[1];
      this.vertex[i*6] = middle[0] + x * Math.cos(angle) - y * Math.sin(angle);
      this.vertex[i*6 + 1] = middle[1] + x * Math.sin(angle) + y * Math.cos(angle);
    }
  }

  isNearVertex(coord) {
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      if (Math.abs(this.vertex[i*6] - coord[0]) < 5 && Math.abs(this.vertex[i*6 + 1] - coord[1]) < 5) {
        return i;
      }
    }
    return -1;
  }
}
