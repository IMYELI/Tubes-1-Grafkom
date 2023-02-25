class line extends shape {
  constructor(gl, coord, color) {
    super(gl.LINES, 0, 2, color, coord);
  }

  isInside(coord) {
    let x = coord[0];
    let y = coord[1];
    let x1 = this.vertex[0];
    let y1 = this.vertex[1];
    let x2 = this.vertex[6];
    let y2 = this.vertex[7];

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;
    let rh = m*x + b;
    let err = 10;
    return (y < rh + err && y > rh - err);
  }

  getMiddle(){    
    // get middle point
    let x1 = this.vertex[0];
    let y1 = this.vertex[1];
    let x2 = this.vertex[6];
    let y2 = this.vertex[7];

    return [(x1 + x2) / 2, (y1 + y2) / 2];

  }

  movePoint(index, coord){
    this.vertex[index*6] = coord[0];
    this.vertex[index*6 + 1] = coord[1];
  }

  translate(coord){
    let middle = this.getMiddle();
    let dx = coord[0] - middle[0];
    let dy = coord[1] - middle[1];
    this.vertex[0] += dx;
    this.vertex[1] += dy;
    this.vertex[6] += dx;
    this.vertex[7] += dy;
  }

  rotate(baseCoord, coord, middle){
    // get angle
    let angle = this.getAngle(coord,middle)

    // get old points
    let x1 = baseCoord[0];
    let y1 = baseCoord[1];
    let x2 = baseCoord[6];
    let y2 = baseCoord[7];

    // get new points
    let x1n = middle[0] + (x1 - middle[0]) * Math.cos(angle) - (y1 - middle[1]) * Math.sin(angle);
    let y1n = middle[1] + (x1 - middle[0]) * Math.sin(angle) + (y1 - middle[1]) * Math.cos(angle);
    let x2n = middle[0] + (x2 - middle[0]) * Math.cos(angle) - (y2 - middle[1]) * Math.sin(angle);
    let y2n = middle[1] + (x2 - middle[0]) * Math.sin(angle) + (y2 - middle[1]) * Math.cos(angle);

    // set new points
    this.vertex[0] = x1n;
    this.vertex[1] = y1n;
    this.vertex[6] = x2n;
    this.vertex[7] = y2n;
  }

  dilate(baseCoord, scale, middle){
    // get old points
    let x1 = baseCoord[0];
    let y1 = baseCoord[1];
    let x2 = baseCoord[6];
    let y2 = baseCoord[7];

    // get new points
    let x1n = middle[0] + (x1 - middle[0]) * scale;
    let y1n = middle[1] + (y1 - middle[1]) * scale;
    let x2n = middle[0] + (x2 - middle[0]) * scale;
    let y2n = middle[1] + (y2 - middle[1]) * scale;

    // set new points
    this.vertex[0] = x1n;
    this.vertex[1] = y1n;
    this.vertex[6] = x2n;
    this.vertex[7] = y2n;
  }
}
