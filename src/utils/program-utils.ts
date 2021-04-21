import { gl } from "@/sauce";
import m4 from "./m4-utils";

export const createProgramInfo = (program: WebGLProgram): ProgramInfo => {
  return {
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
};

export const reassignProgramLocations = (
  program: WebGLProgram,
  programInfo: ProgramInfo
): void => {
  programInfo.program = program;
  programInfo.aVertexPosition.location = gl.getAttribLocation(
    program,
    "aVertexPosition"
  );
  programInfo.aVertexNormal.location = gl.getAttribLocation(
    program,
    "aVertexNormal"
  );
  programInfo.aVertexColor.location = gl.getAttribLocation(
    program,
    "aVertexColor"
  );
  programInfo.uProjectionMatrix.location = gl.getUniformLocation(
    program,
    "uProjectionMatrix"
  );
  programInfo.uViewMatrix.location = gl.getUniformLocation(
    program,
    "uViewMatrix"
  );
  programInfo.uAmbientLight.location = gl.getUniformLocation(
    program,
    "uAmbientLight"
  );
  programInfo.uDirectionalVector.location = gl.getUniformLocation(
    program,
    "uDirectionalVector"
  );
  programInfo.uDirectionalLightColor.location = gl.getUniformLocation(
    program,
    "uDirectionalLightColor"
  );
  programInfo.uLightingOn.location = gl.getUniformLocation(
    program,
    "uLightingOn"
  );
  programInfo.uTransformationMatrix.location = gl.getUniformLocation(
    program,
    "uTransformationMatrix"
  );
  programInfo.uWorldCamPos.location = gl.getUniformLocation(
    program,
    "uWorldCamPos"
  );
};
