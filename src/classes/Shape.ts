import { createProgram } from "../utils/shader-utils";

type GLAttribute = {
  buffer: WebGLBuffer | null;
  location: WebGLUniformLocation | null;
  value: number[];
  size: number;
};

type UniformNumber = "mat4" | "vec3";
type UniformBool = "bool";

type GLUniform =
  | {
      type: UniformNumber;
      location: WebGLUniformLocation | null;
      value: number[];
    }
  | {
      type: UniformBool;
      location: WebGLUniformLocation | null;
      value: boolean;
    };

// uniform vec3 uAmbientLight;
// uniform vec3 uDirectionalVector;
// uniform vec3 uDirectionalLightColor;

type ProgramInfo = {
  program: WebGLProgram;
  aVertexPosition: GLAttribute;
  aVertexNormal: GLAttribute;
  aVertexColor: GLAttribute;
  uTranslation: GLUniform;
  uRotation: GLUniform;
  uScale: GLUniform;
  uProjectionMatrix: GLUniform;
  uViewMatrix: GLUniform;

  uAmbientLight: GLUniform;
  uDirectionalVector: GLUniform;
  uDirectionalLightColor: GLUniform;
  uLightingOn: GLUniform;
  // Kalo perlu yang beda di child class, tambah aja di bawah sini@
  optionalAttribute?: GLAttribute;
  optionalUniform?: GLUniform;
};

export default abstract class Shape {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  programInfo: ProgramInfo;

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    vertexShader: string,
    fragmentShader: string
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.program = createProgram(gl, vertexShader, fragmentShader);

    const { program } = this;
    this.programInfo = {
      program: this.program,
      aVertexPosition: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexPosition"),
        value: [],
        size: 3,
      },
      aVertexNormal: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexNormal"),
        value: [],
        size: 3,
      },
      aVertexColor: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexColor"),
        value: [],
        size: 4,
      },
      uProjectionMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uProjectionMatrix"),
        // prettier-ignore
        value: [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ],
      },
      uViewMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uViewMatrix"),
        // prettier-ignore
        value: [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ],
      },
      uTranslation: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uTranslation"),
        value: [0, 0, 0],
      },
      uRotation: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uRotation"),
        value: [0, 0, 0],
      },
      uScale: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uScale"),
        value: [1, 1, 1],
      },
      uAmbientLight: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uAmbientLight"),
        value: [0.3, 0.3, 0.3],
      },
      uDirectionalVector: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalVector"),
        value: [0.85, 0.8, 0.75],
      },
      uDirectionalLightColor: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalLightColor"),
        value: [1, 1, 1],
      },
      uLightingOn: {
        type: "bool",
        location: gl.getUniformLocation(program, "uLightingOn"),
        value: true,
      },
    };
  }

  loadData(data: any): void {
    console.log(data.programInfo);

    const { program, gl } = this;
    this.programInfo = {
      program: this.program,
      aVertexPosition: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexPosition"),
        value: data.programInfo.aVertexPosition.value,
        size: 3,
      },
      aVertexNormal: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexNormal"),
        value: data.programInfo.aVertexNormal.value,
        size: 3,
      },
      aVertexColor: {
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "aVertexColor"),
        value: data.programInfo.aVertexColor.value,
        size: 4,
      },
      uProjectionMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uProjectionMatrix"),
        // prettier-ignore
        value: data.programInfo.uProjectionMatrix.value
      },
      uViewMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uViewMatrix"),
        // prettier-ignore
        value: data.programInfo.uViewMatrix.value
      },
      uTranslation: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uTranslation"),
        value: data.programInfo.uTranslation.value,
      },
      uRotation: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uRotation"),
        value: data.programInfo.uRotation.value
      },
      uScale: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uScale"),
        value: data.programInfo.uScale.value
      },
      uAmbientLight: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uAmbientLight"),
        value: data.programInfo.uAmbientLight.value,
      },
      uDirectionalVector: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalVector"),
        value: data.programInfo.uDirectionalVector.value
      },
      uDirectionalLightColor: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalLightColor"),
        value: data.programInfo.uDirectionalLightColor.value
      },
      uLightingOn: {
        type: "bool",
        location: gl.getUniformLocation(program, "uLightingOn"),
        value: data.programInfo.uLightingOn.value
      },
    };

    console.log(data.programInfo);
    // this.programInfo = data.programInfo as ProgramInfo;
    // this.persistVars();
	}

  persistAttribute(attr: GLAttribute) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attr.value),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(attr.location as number);
    gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
    gl.vertexAttribPointer(
      attr.location as number,
      attr.size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  persistUniform(uniform: GLUniform) {
    const { gl } = this;
    switch (uniform.type) {
      case "mat4":
        gl.uniformMatrix4fv(
          uniform.location,
          false,
          new Float32Array(uniform.value)
        );
        break;
      case "vec3":
        gl.uniform3fv(uniform.location, new Float32Array(uniform.value));
        break;
      case "bool":
        gl.uniform1i(uniform.location, uniform.value ? 1 : 0);
        break;
    }
  }

  persistVars() {
    this.gl.useProgram(this.program);

    const { programInfo: info } = this;

    // vertex
    this.persistAttribute(info.aVertexPosition);
    this.persistAttribute(info.aVertexNormal);
    this.persistAttribute(info.aVertexColor);
    // transformation
    this.persistUniform(info.uProjectionMatrix);
    this.persistUniform(this.programInfo.uViewMatrix);
    this.persistUniform(info.uRotation);
    this.persistUniform(info.uScale);
    this.persistUniform(info.uTranslation);
    // lighting
    this.persistUniform(info.uAmbientLight);
    this.persistUniform(info.uDirectionalVector);
    this.persistUniform(info.uDirectionalLightColor);
    this.persistUniform(info.uLightingOn);
  }

  // abstract loadData(data: object): void;
  abstract render(): void;
  abstract loadDefaults(): void;

  setProjectionMatrix(projectionMatrix: number[]) {
    this.programInfo.uProjectionMatrix.value = projectionMatrix;
  }

  setViewMatrix(viewMatrix: number[]) {
    this.programInfo.uViewMatrix.value = viewMatrix;
  }

  setTranslation(input: TransformationInput) {
    this.programInfo.uTranslation.value = input;
  }

  setRotate(input: TransformationInput) {
    this.programInfo.uRotation.value = input;
  }

  setScale(input: TransformationInput) {
    this.programInfo.uScale.value = input;
  }

  setLightingConfig(
    ambientLightColor: Color,
    directionalLightColor: Color,
    directionalVector: TransformationInput
  ) {
    this.programInfo.uAmbientLight.value = ambientLightColor;
    this.programInfo.uDirectionalLightColor.value = directionalLightColor;
    this.programInfo.uDirectionalVector.value = directionalVector;
  }

  toggleLighting(on: boolean) {
    this.programInfo.uLightingOn.value = on;
  }

  // abstract toSaveData(): {
  //   // type: ShapeType;
  //   id: number;
  //   color: Color;
  //   selectedColor: Color;
  //   // points: { id: number; pos: Point }[];
  // };

  // TO DO:
  // array of json buat save sama load:
  // satu json = {type, color, selected color, points, id}
}
