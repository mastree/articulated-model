import { gl } from "@/sauce";

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

export const loadTexture = (
  url: string
): [WebGLTexture | null, HTMLImageElement] => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    const isPowerOf2 = (value: number): boolean => {
      return (value & (value - 1)) == 0;
    };
    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return [texture, image];
};
