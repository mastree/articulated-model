type Vec2 = [number, number];
type Vec3 = [number, number, number];

type TransformationInput = [number, number, number];
type Projection = "orthographic" | "oblique" | "perspective";

type CameraConfig = {
  radius: number;
  angle: number;
};

type LightingConfig = {
  ambientLightColor: Color;
  directionalLightColor: Color;
  directionalVector: TransformationInput;
};

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

type ProgramInfo = {
  program: WebGLProgram;
  aVertexPosition: GLAttribute;
  aVertexNormal: GLAttribute;
  aVertexColor: GLAttribute;
  uProjectionMatrix: GLUniform;
  uViewMatrix: GLUniform;
  
  uAmbientLight: GLUniform;
  uDirectionalVector: GLUniform;
  uDirectionalLightColor: GLUniform;
  uLightingOn: GLUniform;
  // Kalo perlu yang beda di child class, tambah aja di bawah sini@
  optionalAttribute?: GLAttribute;
  optionalUniform?: GLUniform;
  
  // For articulation
  uTranslation: number[];
  uRotation: number[];
  uScale: number[];
  anchorPoint: number[]; // length 3 (3D point)
  uAncestorsMatrix: number[];
  uTransformationMatrix: GLUniform;
};
