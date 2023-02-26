class rectangle extends shape {
  constructor(gl, coord, color) {
    super(gl.TRIANGLE_FAN, 0, 4, color, coord);
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

  translate(coord,baseDistance){
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
 

  dilate(baseCoord, scale, middle){
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      this.vertex[i*6] = (baseCoord[i*6] - middle[0]) * scale + middle[0];
      this.vertex[i*6 + 1] = (baseCoord[i*6 + 1] - middle[1]) * scale + middle[1];
    }
  }
  rotate(baseCoord, coord, middle){
    let angle = Math.atan2(coord[1] - middle[1], coord[0] - middle[0]);
    let n = this.getPointCount();
    for (let i = 0; i < n; i += 1) {
      let x = baseCoord[i*6] - middle[0];
      let y = baseCoord[i*6 + 1] - middle[1];
      let newX = x * Math.cos(angle) - y * Math.sin(angle);
      let newY = x * Math.sin(angle) + y * Math.cos(angle);
      this.vertex[i*6] = newX + middle[0];
      this.vertex[i*6 + 1] = newY + middle[1];
    }
  }
  movePoint(index, coord){
    let middle = this.getMiddle();
    let angle = Math.atan2(this.vertex[((index + 1) % 4)*6 + 1] - middle[1], 
    this.vertex[((index + 1) % 4)*6] - middle[0]) - 
    Math.atan2(this.vertex[index*6 + 1] - middle[1], 
    this.vertex[index*6] - middle[0]);
    angle = angle > 0 ? angle : angle + 2 * Math.PI;
    let allAngle = [angle, Math.PI, angle + Math.PI];

    this.vertex[index*6] = coord[0];
    this.vertex[index*6 + 1] = coord[1];
    let x = this.vertex[index*6] - middle[0];
    let y = this.vertex[index*6 + 1] - middle[1];

    for (let i = 0; i < 3; i++) {
      let newX = x * Math.cos(allAngle[i]) - y * Math.sin(allAngle[i]);
      let newY = x * Math.sin(allAngle[i]) + y * Math.cos(allAngle[i]);
      this.vertex[((index + i + 1) % 4)*6] = newX + middle[0];
      this.vertex[((index + i + 1) % 4)*6 + 1] = newY + middle[1];
    }
  }

  isInside(coord){
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

  changeLastCoord(coord) {
    for (let i = 0; i < 3; i++) {
      this.removeVertex(this.getPointCount() - 1);
    }
    this.firstHoverCoord(coord);
  }

  firstHoverCoord(coord) {
    this.pushVertex([coord[0], this.vertex[1]]);
    this.pushVertex([coord[0], coord[1]]);
    this.pushVertex([this.vertex[0], coord[1]]);
  }
}