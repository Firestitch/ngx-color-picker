export function rgbToHEX(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRGB(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHSL(r, g, b) {
  const red		= r / 255;
  const green	= g / 255;
  const blue	= b / 255;

  const cmax = Math.max(red, green, blue);
  const cmin = Math.min(red, green, blue);
  const delta = cmax - cmin;
  let hue = 0;
  let saturation = 0;
  let lightness = (cmax + cmin) / 2;
  const X = (1 - Math.abs(2 * lightness - 1));

  if (delta) {
    if (cmax === red ) { hue = ((green - blue) / delta); }
    if (cmax === green ) { hue = 2 + (blue - red) / delta; }
    if (cmax === blue ) { hue = 4 + (red - green) / delta; }
    if (cmax) saturation = delta / X;
  }

  hue = +Number(60 * hue).toFixed(2);
  if (hue < 0) hue += 360;
  saturation = +Number(saturation * 100).toFixed(2);
  lightness = +Number(lightness * 100).toFixed(2);

  return { hue, saturation, lightness };
}

export function rgbToHSV(r, g, b) {
  const red		= r / 255;
  const green	= g / 255;
  const blue	= b / 255;

  const cmax = Math.max(red, green, blue);
  const cmin = Math.min(red, green, blue);
  const delta = cmax - cmin;
  let hue = 0;
  let saturation = 0;

  if (delta) {
    if (cmax === red ) { hue = ((green - blue) / delta); }
    if (cmax === green ) { hue = 2 + (blue - red) / delta; }
    if (cmax === blue ) { hue = 4 + (red - green) / delta; }
    if (cmax) saturation = delta / cmax;
  }

  hue = +Number(hue * 60).toFixed(2);
  if (hue < 0) hue += 360;
  saturation =  +Number(saturation * 100).toFixed(2);
  const value = +Number(cmax * 100).toFixed(2);
  return { hue, saturation, value };
}
