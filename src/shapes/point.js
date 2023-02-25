class point extends shape{
    constructor(gl, coord, color){
        super(gl.POINTS, 0, 1, color, coord);
    }
}