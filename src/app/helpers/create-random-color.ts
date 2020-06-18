import Color from 'color';

export function createRandomColor() {
  const color = Color().hsv();

  color.color[0] = Math.floor(Math.random() * 360);
  color.color[1] = Math.floor(Math.random() * (10) + 80);
  color.color[2] = Math.floor(Math.random() * (10) + 80);

  return color;
}
