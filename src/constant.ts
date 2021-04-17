import Shape from "./classes/Shape";
import { degToRad } from "./utils/rotate-utils";

// Defaults
type ShapeConfig = {
  uTranslation: TransformationInput;
  uRotation: TransformationInput;
  uScale: TransformationInput;
};

export const CubeDefault: ShapeConfig = {
  uTranslation: [0, 0, 0],
  uRotation: [0, 0, 0],
  uScale: [1, 1, 1],
};

export const TorusDefault: ShapeConfig = {
  uTranslation: [-0.5, -0.5, 0],
  uRotation: [0, degToRad(-45), degToRad(-45)],
  uScale: [0.4, 0.4, 0.4],
};

export const PrismDefault: ShapeConfig = {
  uTranslation: [0, 0.5, 0],
  uRotation: [degToRad(-45), degToRad(-45), degToRad(-90)],
  uScale: [0.25, 0.25, 0.25],
};

export const CameraDefault: CameraConfig = {
  radius: 10,
  angle: 0,
};

export const LightingDefault: LightingConfig = {
  ambientLightColor: [0.3, 0.3, 0.3],
  directionalLightColor: [0.85, 0.8, 0.75],
  directionalVector: [1, 1, 1],
};

export const imageSize = 4;
export const image = [
  0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255,
  0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255,
];
export const texPos = [
  0, 0,
  1, 0,
  1, 1,
  0, 1,
  
  0, 0,
  1, 0,
  1, 1,
  0, 1,

  0, 0,
  1, 0,
  1, 1,
  0, 1,

  0, 0,
  1, 0,
  1, 1,
  0, 1,

  0, 0,
  1, 0,
  1, 1,
  0, 1,

  0, 0,
  1, 0,
  1, 1,
  0, 1,
];

export const ShapeDefaults = [CubeDefault, TorusDefault, PrismDefault];
