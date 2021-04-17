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
