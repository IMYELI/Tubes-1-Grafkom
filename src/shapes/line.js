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

    let distA = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    let distB = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
    let distC = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    let err = 0.1;
    let rh = distA + distB;

    return (rh < distC + err && rh > distC - err);
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

  translate(coord, baseDistance){
    let middle = this.getMiddle();
    let dx = coord[0] - middle[0];
    let dy = coord[1] - middle[1];
    let newDistanceX = dx - baseDistance[0];
    let newDistanceY = dy - baseDistance[1];
    this.vertex[0] += newDistanceX;
    this.vertex[1] += newDistanceY;
    this.vertex[6] += newDistanceX;
    this.vertex[7] += newDistanceY;
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
