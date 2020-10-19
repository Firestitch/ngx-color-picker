export function isContrastYIQDark(rgb, limit = 180) {
  const yiq = ((rgb.red() * 299) + (rgb.green() * 587) + (rgb.blue() * 114)) / 1000;
  return yiq >= limit;
}
