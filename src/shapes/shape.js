class shape {
  constructor(type, offset, shaderCount, color, coord) {
    this.type = type;
    this.shaderCount = shaderCount;
    this.offset = offset;
    this.vertex = coord;
    this.vertex.push(color[0]);
    this.vertex.push(color[1]);
    this.vertex.push(color[2]);
    this.vertex.push(color[3]);
    this.baseColor = [this.vertex[2], this.vertex[3], this.vertex[4], this.vertex[5]];
  }

  draw(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
    gl.drawArrays(this.type, this.offset, this.vertex.length);
  }

  getVertex() {
    return this.vertex;
  }

  getPointCount() { 
    return this.vertex.length / 6;
  }

  setVertex(vertex) {
    this.vertex = vertex;
  }

  getVertexColor(point) {
    return [this.vertex[point * 6 + 2], this.vertex[point * 6 + 3], this.vertex[point * 6 + 4], this.vertex[point * 6 + 5]];
  }

  setVertexColor(point, color) {
    this.vertex[point * 6 + 2] = color[0];
    this.vertex[point * 6 + 3] = color[1];
    this.vertex[point * 6 + 4] = color[2];
    this.vertex[point * 6 + 5] = color[3];
  }
  setGLColor(gl, colorUniformLocation) {
    gl.uniform4f(colorUniformLocation, this.color[0], this.color[1], this.color[2], this.color[3]);
  }

  setVertexCoord(coord, point) {
    this.vertex[point * 6] = coord[0];
    this.vertex[point * 6 + 1] = coord[1];
  }

  getVertexCoord(point) {
    return [this.coord[point * 2], this.coord[point * 2 + 1]];
  }

  pushVertex(coord, color = this.baseColor){
    this.vertex.push(
      coord[0], coord[1],
      color[0], color[1], 
      color[2], color[3]);
  }

  removeVertex(point){
    this.vertex.splice(point * 6, 6);
  }

  //point refers to which point is being selected(the first point in a square or the second etc)
  setVertexCoord(coord, point) {
    this.vertex[point * 6] = coord[0];
    this.vertex[point * 6 + 1] = coord[1];
  }

  isPoint(coord) {
    var error = 4;
    var retVal = { isEndpoint: false, point: -1 };
    var point = this.getPointCount();

    for(let i = 0; i < point; i++){
      if(this.vertex[i*6] - error <= coord[0] && coord[0] <= this.vertex[i*6] + error && this.vertex[i*6 + 1] - error <= coord[1] && coord[1] <= this.vertex[i*6 + 1] + error){
        retVal.isEndpoint = true;
        retVal.point = i;
      }
    }
    console.log(retVal);
    return retVal;
  }
}
