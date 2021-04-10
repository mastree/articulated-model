export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Error on creating shader!");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Error on creating program!");
  }
  const vertShad = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragShad = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertShad);
  gl.attachShader(program, fragShad);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}
       Vertex: ${gl.getShaderInfoLog(vertShad)}
       Fragment: ${gl.getShaderInfoLog(fragShad)}
      `
    );
  }
  return program;
}

export function elementChooser(index: number) {
  const manual = [
    "<p>Membuat garis:" +
      "<ul class='list-inside list-decimal'>" +
      "<li>Pastikan tombol Line pada header sudah terpilih, bila belum silahkan klik tombol Line.</li>" +
      "<li>Arahkan mouse ke titik awal pembuatan garis.</li>" +
      "<li>Klik kiri pada mouse.</li>" +
      "<li>Arahkan mouse ke titik akhir garis.</li>" +
      "<li>Klik kiri pada mouse, garis sudah terbentuk.</li>" +
      "</ul>" +
      "</p>",
  ];
  return manual[index];
}
