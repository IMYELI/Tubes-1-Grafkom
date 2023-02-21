class webglUtils {
  constructor() {
    console.log("Tes");
  }
  /*
   *   Create and compile a shader.
   *
   *   @param gl → webGL context;
   *   @param source → GLSL source
   *   @param type → the type of shader (VERTEX_SHADER or FRAGMENT_SHADER)
   *   @return the shader
   */
  createShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!isSuccess) {
      throw "Could not compile shader: " + gl.getShaderInfoLog(shader);
    }
    return shader;
  }

  /*
   *    create a program that is linked with vertexShader and fragmentShader
   *
   *    @param gl → webGL context;
   *    @param vertexShader → a vertex shader
   *    @param framgentShader → a fragment shader
   *    @return a program
   */
  async createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var program = gl.createProgram();
    var fragmentShader = this.createShader(gl, document.getElementById(fragmentShaderSource).text, gl.FRAGMENT_SHADER);
    var vertexShader = this.createShader(gl, document.getElementById(vertexShaderSource).text, gl.VERTEX_SHADER);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!isSuccess) {
      gl.deleteProgram(program);
      throw "Failed linking program: " + gl.getProgramInfoLog(program);
    }
    return program;
  }

  /*
   *  creating a program using only gl parameter
   *
   *  @param gl → WebGL context;
   *  @return program
   */
  async createDefaultProgram(gl) {
    var program = await this.createProgram(gl, "vertexShader", "fragmentShader");
    return program;
  }

  /*
   *  Function to make our canvas the same size with the pixels that is drawn
   *
   *
   *  @param canvas → our canvas that is used to render the pixels.
   */
  resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }

  getCanvasCoord(e) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();
    return [x - rect.left, y - rect.top];
  }
}
