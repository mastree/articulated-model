export const DefaultSubConfig: SubConfig = {
  offset: 0,
  min: 0,
  max: 0,
};

export const mapRange = (
  val: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => {
  return ((val - min1) * (max2 - min2)) / (max1 - min1) + min2;
};

export const cycleTimeToRange = (time: number, min: number, max: number) => {
  let ang = time % 720;
  if (ang > 360) {
    ang = 720 - ang;
  }
  return mapRange(ang, 0, 360, min, max);
};
