
const vertex_shader = `
  attribute vec4 coord;
  uniform float size;
  void main() {
    gl_Position = coord;
    gl_PointSize = size;
  }
`;

const fragment_shader = `
  precision mediump float;
  uniform vec4 color_value; // includes alpha
  void main() {
    gl_FragColor = color_value;
  }
`;

let canvas, gl;
let coord_attr, color_uniform, size_uniform;
let drawings = [];
let tool = 'point';
let temp_triangle = [];

function main() {
  init_webgl();
  link_shader_vars();

  canvas.onmousedown = (e) => on_click(e);
  canvas.onmousemove = (e) => {
    if (e.buttons === 1 && tool === 'point') on_click(e);
  };

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function init_webgl() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
}

function link_shader_vars() {
  if (!initShaders(gl, vertex_shader, fragment_shader)) return;
  coord_attr = gl.getAttribLocation(gl.program, 'coord');
  color_uniform = gl.getUniformLocation(gl.program, 'color_value');
  size_uniform = gl.getUniformLocation(gl.program, 'size');
}

class dot {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
  }
  render() {
    gl.vertexAttrib3f(coord_attr, this.x, this.y, 0);
    gl.uniform4f(color_uniform, ...this.color);
    gl.uniform1f(size_uniform, this.size);
    gl.drawArrays(gl['points'], 0, 1);
  }
}

function on_click(e) {
  const [x, y] = get_coords(e);
  const r = document.getElementById('rSlider').value / 255;
  const g = document.getElementById('gSlider').value / 255;
  const b = document.getElementById('bSlider').value / 255;
  const size = parseFloat(document.getElementById('sizeSlider').value);
  const a = document.getElementById('aSlider').value;
  const color = [r, g, b, parseFloat(a)];

  if (tool === 'point') {
    drawings.push(new dot(x, y, color, size));
  } else if (tool === 'triangle') {
    temp_triangle.push(x, y);
    if (temp_triangle.length === 6) {
      drawings.push(new triangle(temp_triangle.slice(), color));
      temp_triangle = [];
    }
  } else if (tool === 'circle') {
    const radius = 0.05;
    const segs = parseInt(document.getElementById('segmentsSlider').value);
    drawings.push(new circle(x, y, radius, color, segs));
  }

  draw_all();
}

function get_coords(e) {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
  const y = (canvas.height / 2 - (e.clientY - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function draw_all() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (const shape of drawings) {
    shape.render?.();
  }
}

function clear_screen() {
  drawings = [];
  temp_triangle = [];
  draw_all();
}

function choose_tool(name) {
  tool = name;
  temp_triangle = [];
}

function drawPicture() {
  drawings.push(new triangle([-0.5, 0, -0.25, 0.5, 0, 0], [1, 0, 0, 1]));
  drawings.push(new triangle([0, 0, 0.25, 0.5, 0.5, 0], [0, 0, 1, 1]));
  drawings.push(new triangle([-0.3, -0.3, 0, 0, -0.2, -0.6], [0, 1, 0, 1]));
  draw_all();
}


function show_picture() {
  drawings = [];

  const red = [1, 0, 0, 1];
  const green = [0, 1, 0, 1];
  const blue = [0, 0, 1, 1];
  const yellow = [1, 1, 0, 1];
  const magenta = [1, 0, 1, 1];
  const cyan = [0, 1, 1, 1];
  const white = [1, 1, 1, 1];

  const triangles = [
    [-0.6, 0.0, -0.3, 0.4, 0.0, 0.0, red],
    [-0.3, 0.4, 0.0, 0.0, 0.3, 0.4, green],
    [0.0, 0.0, 0.3, 0.4, 0.6, 0.0, blue],
    [-0.6, 0.0, 0.0, 0.0, -0.3, -0.4, yellow],
    [0.0, 0.0, -0.3, -0.4, 0.3, -0.4, magenta],
    [0.0, 0.0, 0.3, -0.4, 0.6, 0.0, cyan],

    [-0.75, 0.5, -0.6, 0.0, -0.45, 0.5, red],
    [-0.15, 0.5, 0.0, 0.0, 0.15, 0.5, green],
    [0.45, 0.5, 0.6, 0.0, 0.75, 0.5, blue],

    [-0.45, -0.5, -0.3, -0.4, -0.15, -0.5, yellow],
    [0.15, -0.5, 0.3, -0.4, 0.45, -0.5, cyan],

    [-0.3, 0.4, -0.15, 0.65, 0.0, 0.4, red],
    [0.0, 0.4, 0.15, 0.65, 0.3, 0.4, green],
    [0.3, -0.4, 0.15, -0.65, 0.0, -0.4, blue],
    [0.0, -0.4, -0.15, -0.65, -0.3, -0.4, magenta],

    [-0.15, 0.15, 0.0, 0.3, 0.15, 0.15, white],
    [-0.15, -0.15, 0.0, -0.3, 0.15, -0.15, white],
    [-0.15, -0.15, -0.15, 0.15, 0.0, 0.0, white],
    [0.15, -0.15, 0.15, 0.15, 0.0, 0.0, white],
  ];

  for (const tri of triangles) {
    const coords = tri.slice(0, 6);
    const color = tri[6];
    drawings.push(new triangle(coords, color));
  }

  draw_all();
}
