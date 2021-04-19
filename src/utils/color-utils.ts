export function hexToRGB(hexadec: string) {
  const hexadec_r = hexadec[1] + hexadec[2];
  const hexadec_g = hexadec[3] + hexadec[4];
  const hexadec_b = hexadec[5] + hexadec[6];
  const color_arr = [
    parseInt(hexadec_r, 16) / 255,
    parseInt(hexadec_g, 16) / 255,
    parseInt(hexadec_b, 16) / 255,
  ] as Vec3;
  return color_arr;
}

export function rgbToHex(rgb: Vec3) {
  const hexStr = [
    Math.round(rgb[0] * 255).toString(16),
    Math.round(rgb[1] * 255).toString(16),
    Math.round(rgb[2] * 255).toString(16),
  ];
  let ret = `#`;
  hexStr.forEach((str) => {
    let add = str;
    if (add.length == 1) {
      add = "0" + add;
    }
    ret += add;
  });
  return ret;
}
