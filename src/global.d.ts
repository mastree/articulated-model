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

type UniformNumber = "float" | "double" | "int";
type UniformVNumber = "mat4" | "vec3" | "vec2";
type UniformBool = "bool";
type UniformSampler2D = "sampler2D";

type GLUniform =
  | {
      type: UniformVNumber;
      location: WebGLUniformLocation | null;
      value: number[];
    }
  | {
      type: UniformBool;
      location: WebGLUniformLocation | null;
      value: boolean;
    }
  | {
      type: UniformSampler2D;
      location: WebGLUniformLocation | null;
      value: number;
    }
  | {
      type: UniformNumber;
      location: WebGLUniformLocation | null;
      value: number;
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
  uWorldCamPos: GLUniform;
};

// from https://csawesome.runestone.academy/runestone/books/published/learnwebgl2/11_surface_properties/10_bump_maps.html
type BumpProgramInfo = {
  // ProgramInfo
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
  uWorldCamPos: GLUniform;
  // End of ProgramInfo

  u_Light_position: GLUniform;
  u_Light_color: GLUniform;
  u_Shininess: GLUniform;
  u_Ambient_intensities: GLUniform;
  u_Image_size: GLUniform;
  uSampler: GLUniform;
  uBumpSampler: GLUniform;
  a_Vertex: GLAttribute;
  a_Normal: GLAttribute;
  a_Texture_coordinate: GLAttribute;
  a_P2: GLAttribute;
  a_P3: GLAttribute;
  a_Uv2: GLAttribute;
  a_Uv3: GLAttribute;
};

type SubConfig = {
  offset: number;
  min: number;
  max: number;
};

type AnimationConfig = {
  rotation: [SubConfig, SubConfig, SubConfig];
};
