import { cubeVertexShader } from "../shader/vertex";
import { cubeFragmentShader } from "../shader/fragment";
import { degToRad } from "../utils/rotate-utils";
import Shape from "./Shape";
import { CubeDefault } from "../constant";
import vector from "../utils/vector-utils";

// prettier-ignore
export default class Cube extends Shape {
  indexBuffer: WebGLBuffer | null;
  
  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    super(canvas, gl, cubeVertexShader, cubeFragmentShader);
    const vertices = [
      // Front face
      -1, -1,  1,
      1, -1,  1,
      1,  1,  1,
      -1,  1,  1,

      // Back face
      -1, -1, -1,
      -1,  1, -1,
      1,  1, -1,
      1, -1, -1,

      // Top face
      -1,  1, -1,
      -1,  1,  1,
        1,  1,  1,
        1,  1, -1,

      // Bottom face
      -1, -1, -1,
        1, -1, -1,
        1, -1,  1,
      -1, -1,  1,

      // Right face
        1, -1, -1,
        1,  1, -1,
        1,  1,  1,
        1, -1,  1,

      // Left face
      -1, -1, -1,
      -1, -1,  1,
      -1,  1,  1,
      -1,  1, -1,
    ];
    
    const faceColors = [
      [0.0,  0.0,  0.0,  1.0],    // Front face: black
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
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
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];

    const normals: [number, number, number][] = []
    for (let i = 0; i < 6; i++) {
      const normCoords = [];
      for (let j = 0; j < 3; j++) {
        const chosenIdx = idx[i * 6 + j];
        normCoords.push(vertices[chosenIdx * 3], vertices[chosenIdx * 3 + 1], vertices[chosenIdx * 3 + 2]);
      }
      
      const normal = vector.normal(
        normCoords[0], normCoords[1], normCoords[2],
        normCoords[3], normCoords[4], normCoords[5],
        normCoords[6], normCoords[7], normCoords[8],
      )
      normals.push([normal.x, normal.y, normal.z]);
    }

    const vertexNormal: number[] = [] 
    for (const norm of normals) {
      for (let i = 0; i < 4; i++) {
        vertexNormal.push(...norm)
      }
    }
    this.programInfo.aVertexNormal.value = vertexNormal;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  }

  loadDefaults() {
    this.programInfo.uTranslation.value = CubeDefault.uTranslation
    this.programInfo.uScale.value = CubeDefault.uScale
    this.programInfo.uRotation.value = CubeDefault.uRotation
  }

  render() {
    const {gl, program} = this;
    this.persistVars();
    
    gl.useProgram(program);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    return;
  }
}
