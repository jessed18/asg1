class triangle {
  constructor(points, color) {
    this.points = points;
    this.color = color;
  }

  render() {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(coord_attr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord_attr);
    gl.uniform4f(color_uniform, ...this.color);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.deleteBuffer(buf);
  }
}
