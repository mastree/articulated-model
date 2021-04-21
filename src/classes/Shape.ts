import { gl } from "../sauce";
import m4 from "../utils/m4-utils";
import {
  createShader,
  createProgram,
  loadTexture,
} from "../utils/shader-utils";
import { imageSize, image, texPos, texCoords } from "../constant";
import { vertexShaders } from "../shader/vertex";
import { fragmentShaders } from "../shader/fragment";
import { environmentTexture, patternTexture } from "@/utils/texture-utils";
import {
  createProgramInfo,
  reassignProgramLocations,
} from "@/utils/program-utils";

export default abstract class Shape {
  program: WebGLProgram;
  programInfo: ProgramInfo;
  children: Shape[] = [];
  vertices: number[] = [];
  animate: boolean = false;
  animationSpeed: number = 0.5;
  animationConfig: AnimationConfig = {
    rotation: [
      { offset: 0, min: 0, max: 0 },
      { offset: 0, min: 0, max: 0 },
      { offset: 0, min: 0, max: 0 },
    ],
  };
  scaledTime: number = 0;
  selectedShader: number = 1;

  constructor(public name: string = "Default Shape Name") {
    this.program = createProgram(
      gl,
      vertexShaders[this.selectedShader],
      fragmentShaders[this.selectedShader]
    );
    const { program } = this;
    this.programInfo = createProgramInfo(program);
  }

  getSaveShape(): any {
    type SaveShape = {
      programInfo: ProgramInfo;
      children: SaveShape[];
      animate: boolean;
      animationSpeed: number;
      animationConfig: AnimationConfig;
      name: string;
    };
    var node: SaveShape = {
      programInfo: this.programInfo,
      children: [],
      animate: this.animate,
      animationSpeed: this.animationSpeed,
      animationConfig: this.animationConfig,
      name: this.name,
    };
    for (const child of this.children) {
      node.children.push(child.getSaveShape());
    }
    return node;
  }

  loadTopData(data: any) {
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
      uWorldCamPos: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uWorldCamPos"),
        value: data.programInfo.uWorldCamPos.value,
      },
    };
    this.children = [];
    this.animate = data.animate;
    this.animationSpeed = data.animationSpeed;
    this.animationConfig = data.animationConfig;
    this.name = data.name;
    this.setSelectedShader(this.selectedShader);
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
    // console.log("hay", gl.getProgramInfoLog(this.program));
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
      case "vec2":
        gl.uniform2fv(uniform.location, new Float32Array(uniform.value));
        break;
      case "bool":
        gl.uniform1i(uniform.location, uniform.value ? 1 : 0);
        break;
    }
  }

  persistVars() {
    gl.useProgram(this.program);

    const { programInfo: info } = this;

    this.programInfo.uTransformationMatrix.value = m4.multiply(
      info.uAncestorsMatrix as number[],
      this.getLocalTransformation()
    );
    const {
      program,
      uTranslation,
      uRotation,
      uScale,
      anchorPoint,
      uAncestorsMatrix,
      ...rest
    } = info;
    for (const variable of Object.values(rest)) {
      if (typeof variable?.location !== "number") {
        this.persistUniform(variable);
      } else {
        this.persistAttribute(variable);
      }
    }
  }

  abstract render(): void;
  abstract renderWith(addTrans: number[]): void;
  abstract loadDefaults(): void;

  initShader() {
    const { program } = this;

    if (this.selectedShader == 1) {
      patternTexture(program);
    } else if (this.selectedShader == 2) {
      environmentTexture(program);
    } else if (this.selectedShader == 3) {
      // https://csawesome.runestone.academy/runestone/books/published/learnwebgl2/11_surface_properties/10_bump_maps.html
      const { vertices } = this;

      const src1 = "/img/brick.png",
        src2 = "/img/brick_bump.png";
      const [texture, textureImage] = loadTexture(src1);
      const [bumpTexture, bumpImage] = loadTexture(src2);
      textureImage.src = src1;
      bumpImage.src = src2;

      const oldLoad = bumpImage.onload;
      let u_Image_size = [bumpImage.width ?? 0, bumpImage.height ?? 0];
      bumpImage.onload = function (e) {
        oldLoad?.call(this, e);
        u_Image_size = [bumpImage.width, bumpImage.height];
      };
      const bruh = gl.getUniformLocation(program, "u_Image_size");
      console.log("bruh", bruh);
      gl.uniform2fv(
        gl.getUniformLocation(program, "u_Image_size"),
        new Float32Array(u_Image_size)
      );

      // texCoords
      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(texCoords),
        gl.STATIC_DRAW
      );

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bumpTexture);

      let a_P2 = [],
        a_P3 = [],
        a_Uv2 = [],
        a_Uv3 = [];
      for (let n = 0, m = 0; n < vertices.length; n += 9, m += 6) {
        // For the 1st vertex in the triangle
        a_P2[n] = vertices[n + 3];
        a_P2[n + 1] = vertices[n + 4];
        a_P2[n + 2] = vertices[n + 5];

        a_P3[n] = vertices[n + 6];
        a_P3[n + 1] = vertices[n + 7];
        a_P3[n + 2] = vertices[n + 8];

        a_Uv2[m] = texCoords[m + 2];
        a_Uv2[m + 1] = texCoords[m + 3];

        a_Uv3[m] = texCoords[m + 4];
        a_Uv3[m + 1] = texCoords[m + 5];

        // For the 2nd vertex in the triangle
        a_P2[n + 3] = vertices[n + 6];
        a_P2[n + 4] = vertices[n + 7];
        a_P2[n + 5] = vertices[n + 8];

        a_P3[n + 3] = vertices[n];
        a_P3[n + 4] = vertices[n + 1];
        a_P3[n + 5] = vertices[n + 2];

        a_Uv2[m + 2] = texCoords[m + 4];
        a_Uv2[m + 3] = texCoords[m + 5];

        a_Uv3[m + 2] = texCoords[m];
        a_Uv3[m + 3] = texCoords[m + 1];

        // For the 3rd vertex in the triangle
        a_P2[n + 6] = vertices[n];
        a_P2[n + 7] = vertices[n + 1];
        a_P2[n + 8] = vertices[n + 2];

        a_P3[n + 6] = vertices[n + 3];
        a_P3[n + 7] = vertices[n + 4];
        a_P3[n + 8] = vertices[n + 5];

        a_Uv2[m + 4] = texCoords[m];
        a_Uv2[m + 5] = texCoords[m + 1];

        a_Uv3[m + 4] = texCoords[m + 2];
        a_Uv3[m + 5] = texCoords[m + 3];
      }
      const uSampler = 0,
        uBumpSampler = 1;
      const loc1 = gl.getUniformLocation(program, "uSampler");
      const loc2 = gl.getUniformLocation(program, "uBumpSampler");
      gl.uniform1i(loc1, uSampler);
      gl.uniform1i(loc2, uBumpSampler);
      const custApplyAtr = (
        program: WebGLProgram,
        name: string,
        value: number[],
        size: number
      ) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value), gl.STATIC_DRAW);

        const location = gl.getAttribLocation(program, name);
        // console.log(name, location);
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
      };
      // attribute vec3 a_P2;
      // attribute vec3 a_P3;
      // attribute vec2 a_Uv2;
      // attribute vec2 a_Uv3;
      custApplyAtr(program, "a_Texture_coordinate", texCoords, 2);
      custApplyAtr(program, "a_P2", a_P2, 3);
      custApplyAtr(program, "a_P3", a_P3, 3);
      custApplyAtr(program, "a_Uv2", a_Uv2, 2);
      custApplyAtr(program, "a_Uv3", a_Uv3, 2);
    }
  }

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

  setAnimationSpeed(nSpeed: number) {
    this.animationSpeed = nSpeed;
  }

  addTime(delta: number) {
    this.scaledTime += delta * this.animationSpeed;
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

  setWorldCamPos(pos: number[]) {
    this.programInfo.uWorldCamPos.value = pos;
  }

  setSelectedShader(id: number) {
    this.selectedShader = id;

    this.program = createProgram(
      gl,
      vertexShaders[this.selectedShader],
      fragmentShaders[this.selectedShader]
    );
    const { program } = this;
    reassignProgramLocations(program, this.programInfo);
    this.initShader();
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
