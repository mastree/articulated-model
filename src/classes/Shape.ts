import { gl } from "../sauce";
import m4 from "../utils/m4-utils";
import { createShader, createProgram } from "../utils/shader-utils";
import { imageSize, image, texPos } from "../constant";
import {
  textureCubeVertexShader,
  environmentCubeVertexShader,
  cubeVertexShader,
  bumpCubeVertexShader,
} from "../shader/vertex";
import {
  textureFragmentShader,
  environmentFragmentShader,
  cubeFragmentShader,
  bumpFragmentShader,
} from "../shader/fragment";

const loadTexture = (url: string): [WebGLTexture | null, HTMLImageElement] => {
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

export default abstract class Shape {
  program: WebGLProgram;
  // programs: WebGLProgram[] = [];
  programInfo: ProgramInfo;
  // programInfos: ProgramInfo[] = [];
  children: Shape[] = [];
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
  vertexShaders: string[] = [
    cubeVertexShader,
    textureCubeVertexShader,
    environmentCubeVertexShader,
    bumpCubeVertexShader,
  ];
  fragmentShaders: string[] = [
    cubeFragmentShader,
    textureFragmentShader,
    environmentFragmentShader,
    bumpFragmentShader,
  ];

  constructor(
    vertexShader: string,
    fragmentShader: string,
    public name: string = "Default Shape Name"
  ) {
    this.program = createProgram(
      gl,
      this.vertexShaders[this.selectedShader],
      this.fragmentShaders[this.selectedShader]
    );
    const { program } = this;
    this.programInfo = {
      program: program,
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
      uWorldCamPos: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uWorldCamPos"),
        value: [0, 0, 0],
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
      uWorldCamPos: {
        type: "vec3",
        location: gl.getUniformLocation(program, "uWorldCamPos"),
        value: data.programInfo.uWorldCamPos.value,
      },
    };
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
    this.persistUniform(info.uWorldCamPos);

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

  initShader() {
    const { program } = this;

    if (this.selectedShader == 1) {
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
    } else if (this.selectedShader == 2) {
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
          // image.addEventListener("load", function () {
          //   // Now that the image has loaded make copy it to the texture.
          //   gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
          //   gl.texImage2D(target, level, internalFormat, format, type, image);
          //   gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
          // });
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
        console.log(gl.getUniformLocation(program, "texture"));
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

        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_MAG_FILTER,
          gl.NEAREST
        );
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_MIN_FILTER,
          gl.NEAREST
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
      }
    } else if (this.selectedShader == 3) {
      // TODO: bump mapping
      const [texture, textureImage] = loadTexture("/img/taj_orig.jpg");
      const [bumpTexture, bumpImage] = loadTexture("/img/taj_emboss.jpg");

      // prettier-ignore
      const texCoords = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ];

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bumpTexture);
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
      this.vertexShaders[this.selectedShader],
      this.fragmentShaders[this.selectedShader]
    );
    const { program } = this;
    this.programInfo.program = program;
    this.programInfo.aVertexPosition.location = gl.getAttribLocation(
      program,
      "aVertexPosition"
    );
    this.programInfo.aVertexNormal.location = gl.getAttribLocation(
      program,
      "aVertexNormal"
    );
    this.programInfo.aVertexColor.location = gl.getAttribLocation(
      program,
      "aVertexColor"
    );
    this.programInfo.uProjectionMatrix.location = gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );
    this.programInfo.uViewMatrix.location = gl.getUniformLocation(
      program,
      "uViewMatrix"
    );
    this.programInfo.uAmbientLight.location = gl.getUniformLocation(
      program,
      "uAmbientLight"
    );
    this.programInfo.uDirectionalVector.location = gl.getUniformLocation(
      program,
      "uDirectionalVector"
    );
    this.programInfo.uDirectionalLightColor.location = gl.getUniformLocation(
      program,
      "uDirectionalLightColor"
    );
    this.programInfo.uLightingOn.location = gl.getUniformLocation(
      program,
      "uLightingOn"
    );
    this.programInfo.uTransformationMatrix.location = gl.getUniformLocation(
      program,
      "uTransformationMatrix"
    );
    this.programInfo.uWorldCamPos.location = gl.getUniformLocation(
      program,
      "uWorldCamPos"
    );
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
