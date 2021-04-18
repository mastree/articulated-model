export const radToDeg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

export const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};

export const vDegToRad = (degs: Vec3): Vec3 => {
  return degs.map((e) => degToRad(e)) as Vec3;
};
