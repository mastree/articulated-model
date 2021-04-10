type Point2d = [number, number];
type Point3d = [number, number, number];
type Color = [number, number, number];

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
