import { cubeVertexShader } from "../shader/vertex";
import { cubeFragmentShader } from "../shader/fragment";
import { degToRad } from "../utils/rotate-utils";
import Shape from "./Shape";
import { CubeDefault, imageSize, image, texPos } from "../constant";
import vector from "../utils/vector-utils";
import { gl } from "../sauce";

// generate 8 vertices
export const genCubeVertices = (center: Vec3, size: Vec3): Vec3[] => {
  const halfSize = size.map((s) => s / 2);
  // prettier-ignore
  return [
    [center[0] - halfSize[0], center[1] - halfSize[1], center[2] - halfSize[2]],
    [center[0] + halfSize[0], center[1] - halfSize[1], center[2] - halfSize[2]],
    [center[0] + halfSize[0], center[1] - halfSize[1], center[2] + halfSize[2]],
    [center[0] - halfSize[0], center[1] - halfSize[1], center[2] + halfSize[2]],
    [center[0] - halfSize[0], center[1] + halfSize[1], center[2] - halfSize[2]],
    [center[0] + halfSize[0], center[1] + halfSize[1], center[2] - halfSize[2]],
    [center[0] + halfSize[0], center[1] + halfSize[1], center[2] + halfSize[2]],
    [center[0] - halfSize[0], center[1] + halfSize[1], center[2] + halfSize[2]],
  ]
};

const toGlVertices = (cubePoints: Vec3[]): number[] => {
  const standardVertices = genCubeVertices([0, 0, 0], [2, 2, 2]);
  const standardGLVertices = [
    // Front face
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
    // Back face
    [-1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
    [1, -1, -1],
    // Top face
    [-1, 1, -1],
    [-1, 1, 1],
    [1, 1, 1],
    [1, 1, -1],
    // Bottom face
    [-1, -1, -1],
    [1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    // Right face
    [1, -1, -1],
    [1, 1, -1],
    [1, 1, 1],
    [1, -1, 1],
    // Left face
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, 1, -1],
  ];
  const idx: number[] = [];
  for (const v of standardGLVertices) {
    standardVertices.forEach((sv, index) => {
      if (v[0] == sv[0] && v[1] == sv[1] && v[2] == sv[2]) {
        idx.push(index);
      }
    });
  }
  return idx
    .map((i) => {
      return cubePoints[i];
    })
    .flat();
};

type CubeConfig = {
  center?: Vec3;
  size?: Vec3;
  vertices?: Vec3[];
};

export class Cube extends Shape {
  indexBuffer: WebGLBuffer | null;

  constructor(name: string = "Default Cube Name", cubeConfig?: CubeConfig) {
    super(cubeVertexShader, cubeFragmentShader, name);
    const vertices: number[] = cubeConfig
      ? cubeConfig.vertices
        ? toGlVertices(cubeConfig.vertices)
        : toGlVertices(genCubeVertices(cubeConfig.center!, cubeConfig.size!))
      : toGlVertices(genCubeVertices([0, 0, 0], [2, 2, 2]));
    const faceColors = [
      [1.0, 1.0, 1.0, 1.0], // Front face: white
      [1.0, 0.0, 0.0, 1.0], // Back face: red
      [0.0, 1.0, 0.0, 1.0], // Top face: green
      [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
      [1.0, 1.0, 0.0, 1.0], // Right face: yellow
      [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    // Convert the array of colors into a table for all the vertices.
    var colors: number[] = [];
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }
    this.programInfo.aVertexPosition.value = vertices;
    this.programInfo.aVertexColor.value = colors;
    this.loadDefaults();

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    const idx = [
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];

    const normals: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const normCoords = [];
      for (let j = 0; j < 3; j++) {
        const chosenIdx = idx[i * 6 + j];
        normCoords.push(
          vertices[chosenIdx * 3],
          vertices[chosenIdx * 3 + 1],
          vertices[chosenIdx * 3 + 2]
        );
      }

      const normal = vector.normal(
        normCoords[0],
        normCoords[1],
        normCoords[2],
        normCoords[3],
        normCoords[4],
        normCoords[5],
        normCoords[6],
        normCoords[7],
        normCoords[8]
      );
      normals.push([normal.x, normal.y, normal.z]);
    }

    const vertexNormal: number[] = [];
    for (const norm of normals) {
      for (let i = 0; i < 4; i++) {
        vertexNormal.push(...norm);
      }
    }
    this.programInfo.aVertexNormal.value = vertexNormal;
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(idx),
      gl.STATIC_DRAW
    );
  }

  loadDefaults() {
    this.programInfo.uTranslation.value = CubeDefault.uTranslation;
    this.programInfo.uScale.value = CubeDefault.uScale;
    this.programInfo.uRotation.value = CubeDefault.uRotation;
  }

  render() {
    const { program } = this;
    this.persistVars();

    gl.useProgram(program);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    return;
  }

  renderWith(addTrans: number[]) {
    const { program } = this;

    this.programInfo.uAncestorsMatrix.value = addTrans;
    this.persistVars();

    gl.useProgram(program);

    // Texture
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

    // End texture

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    return;
  }
}
