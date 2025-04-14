
class circle {
  constructor(x, y, radius, color, segments = 32) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.segments = segments;
  }

  render() {
    const coords = [this.x, this.y];
    for (let i = 0; i <= this.segments; i++) {
      const angle = (2 * Math.PI * i) / this.segments;
      const px = this.x + this.radius * Math.cos(angle);
      const py = this.y + this.radius * Math.sin(angle);
      coords.push(px, py);
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(coord_attr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord_attr);
    gl.uniform4f(color_uniform, ...this.color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segments + 2);
    gl.deleteBuffer(buffer);
  }
}
