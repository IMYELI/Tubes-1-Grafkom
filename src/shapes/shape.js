class shape {
  constructor(type, offset, shaderCount, color, coord) {
    this.type = type;
    this.shaderCount = shaderCount;
    this.offset = offset;
    this.color = color;
    this.coord = coord;
  }

  draw(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.coord), gl.STATIC_DRAW);
    gl.drawArrays(this.type, this.offset, this.shaderCount);
  }

  getCoord() {
    return this.coord;
  }

  setCoord(coord) {
    this.coord = coord;
  }

  pushCoord(x, y) {
    this.coord.push(x, y);
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }
  setGLColor(gl, colorUniformLocation) {
    gl.uniform4f(colorUniformLocation, this.color[0], this.color[1], this.color[2], this.color[3]);
  }
}
