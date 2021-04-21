import { image, imageSize, texPos } from "@/constant";
import { gl } from "@/sauce";

export const patternTexture = (program: WebGLProgram) => {
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    imageSize,
    imageSize,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(image)
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPos), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.enableVertexAttribArray(vTexCoord);
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
};

export const environmentTexture = (program: WebGLProgram) => {
  let useImg = !false;
  if (useImg) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: "/img/pos-x.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: "/img/neg-x.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: "/img/pos-y.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: "/img/neg-y.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: "/img/pos-z.jpg",
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: "/img/neg-z.jpg",
      },
    ];
    faceInfos.forEach((faceInfo) => {
      const { target, url } = faceInfo;

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      // setup each face so it's immediately renderable
      gl.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        0,
        format,
        type,
        null
      );

      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
  } else {
    let cubeMap = gl.createTexture();

    let red = new Uint8Array([255, 0, 0, 255]);
    let green = new Uint8Array([0, 255, 0, 255]);
    let blue = new Uint8Array([0, 0, 255, 255]);
    let cyan = new Uint8Array([0, 255, 255, 255]);
    let magenta = new Uint8Array([255, 0, 255, 255]);
    let yellow = new Uint8Array([255, 255, 0, 255]);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      red
    );
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      green
    );
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      blue
    );
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      cyan
    );
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      yellow
    );
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      magenta
    );

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
  }
};
