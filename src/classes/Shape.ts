import { gl } from "../sauce";
import m4 from "../utils/m4-utils";
import { createProgram } from "../utils/shader-utils";

export default abstract class Shape {
  program: WebGLProgram;
  programInfo: ProgramInfo;
  children: Shape[] = [];
  animate: boolean = true; // TODO: set defaultnya false, bikin toggler
  animationConfig: AnimationConfig = {
    rotation: [
      { offset: 0, min: 0, max: 0 },
      { offset: 0, min: 0, max: 0 },
      { offset: 0, min: 0, max: 0 },
    ],
  };
  scaledTime: number = 0;

  constructor(
    vertexShader: string,
    fragmentShader: string,
    public name: string = "Default Shape Name"
  ) {
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
        value: m4.identity(),
      },
      uViewMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uViewMatrix"),
        value: m4.identity(),
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
      uTranslation: [0, 0, 0],
      uRotation: [0, 0, 0],
      uScale: [1, 1, 1],
      anchorPoint: [0, 0, 0],
      uAncestorsMatrix: m4.identity(),
      uTransformationMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uTransformationMatrix"),
        value: m4.identity(),
      },
    };
  }

  loadData(data: any): void {
    console.log(data.programInfo);

    const { program } = this;
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
        value: data.programInfo.uProjectionMatrix.value,
      },
      uViewMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uViewMatrix"),
        value: data.programInfo.uViewMatrix.value,
      },
      uAmbientLight: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uAmbientLight"),
        value: data.programInfo.uAmbientLight.value,
      },
      uDirectionalVector: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalVector"),
        value: data.programInfo.uDirectionalVector.value,
      },
      uDirectionalLightColor: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uDirectionalLightColor"),
        value: data.programInfo.uDirectionalLightColor.value,
      },
      uLightingOn: {
        type: "bool",
        location: gl.getUniformLocation(program, "uLightingOn"),
        value: data.programInfo.uLightingOn.value,
      },
      uTranslation: data.programInfo.uTranslation,
      uRotation: data.programInfo.uRotation,
      uScale: data.programInfo.uScale,
      anchorPoint: data.programInfo.anchorPoint,
      uAncestorsMatrix: data.programInfo.uAncestorsMatrix,
      uTransformationMatrix: {
        type: "mat4",
        location: gl.getUniformLocation(program, "uTransformationMatrix"),
        value: data.programInfo.uTransformationMatrix.value,
      },
    };

    console.log(data.programInfo);
  }

  persistAttribute(attr: GLAttribute) {
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
    gl.useProgram(this.program);

    const { programInfo: info } = this;

    // vertex
    this.persistAttribute(info.aVertexPosition);
    this.persistAttribute(info.aVertexNormal);
    this.persistAttribute(info.aVertexColor);
    // transformation
    this.persistUniform(info.uProjectionMatrix);
    this.persistUniform(this.programInfo.uViewMatrix);

    this.programInfo.uTransformationMatrix.value = m4.multiply(
      info.uAncestorsMatrix as number[],
      this.getLocalTransformation()
    );
    this.persistUniform(this.programInfo.uTransformationMatrix);

    // lighting
    this.persistUniform(info.uAmbientLight);
    this.persistUniform(info.uDirectionalVector);
    this.persistUniform(info.uDirectionalLightColor);
    this.persistUniform(info.uLightingOn);
  }

  // abstract loadData(data: object): void;
  abstract render(): void;
  abstract renderWith(addTrans: number[]): void;
  abstract loadDefaults(): void;

  setProjectionMatrix(projectionMatrix: number[]) {
    this.programInfo.uProjectionMatrix.value = projectionMatrix;
  }

  setViewMatrix(viewMatrix: number[]) {
    this.programInfo.uViewMatrix.value = viewMatrix;
  }

  setTranslation(input: TransformationInput) {
    this.programInfo.uTranslation = input;
  }

  setRotate(input: TransformationInput) {
    this.programInfo.uRotation = input;
  }

  rotate(rot: number[]) {
    let rotMat = m4.identity();
    rotMat = m4.xRotate(rotMat, rot[0]);
    rotMat = m4.yRotate(rotMat, rot[1]);
    rotMat = m4.zRotate(rotMat, rot[2]);
    console.log(rotMat);
    let temp: number[][] = [];
    let curNode = this.programInfo.aVertexPosition.value as number[];
    for (let i = 0; i < curNode.length; i++) {
      if (i % 3 == 0) temp.push([]);
      temp[temp.length - 1].push(curNode[i]);
    }
    for (let i = 0; i < temp.length; i++) {
      let nval = [0, 0, 0];
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          nval[j] += temp[i][k] * rotMat[k * 4 + j];
        }
      }
      temp[i] = nval;
    }
    this.programInfo.aVertexPosition.value = temp.flat();
  }

  setAnimationConfig(config: AnimationConfig) {
    this.animationConfig = { ...config };
  }

  addTime(delta: number) {
    const speedEuy = 0.5;
    this.scaledTime += delta * speedEuy;
    this.scaledTime %= 720;
    if (this.scaledTime < 0) this.scaledTime += 720;
  }

  setScale(input: TransformationInput) {
    this.programInfo.uScale = input;
  }

  setLightingConfig(
    ambientLightColor: Vec3,
    directionalLightColor: Vec3,
    directionalVector: TransformationInput
  ) {
    this.programInfo.uAmbientLight.value = ambientLightColor;
    this.programInfo.uDirectionalLightColor.value = directionalLightColor;
    this.programInfo.uDirectionalVector.value = directionalVector;
  }

  setAnchorPoint(anchorPoint: number[]) {
    this.programInfo.anchorPoint = anchorPoint;
  }

  addChild(shape: Shape) {
    this.children.push(shape);
  }

  getLocalTransformation(): number[] {
    let ret = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let trans = [...(this.programInfo.uTranslation as number[])];
    for (let i = 0; i < 3; i++) trans[i] += this.programInfo.anchorPoint[i];
    ret = m4.multiply(ret, m4.translation(trans[0], trans[1], trans[2]));

    let rot = this.programInfo.uRotation as number[];
    ret = m4.xRotate(ret, rot[0]);
    ret = m4.yRotate(ret, rot[1]);
    ret = m4.zRotate(ret, rot[2]);

    let scale = this.programInfo.uScale as number[];
    ret = m4.scale(ret, scale[0], scale[1], scale[2]);
    return ret;
  }

  toggleLighting(on: boolean) {
    this.programInfo.uLightingOn.value = on;
  }
}
