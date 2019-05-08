import { RGBA } from '../interfaces/rgba';
import { HSL } from '../interfaces/hsl';
import { round } from 'lodash-es';
import Color from 'color';

export function rgbToHex(rgb: RGBA): string {
  return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

export function hexToRgb(hex: string): RGBA {

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


export function rgbToHsl(rgb: RGBA): HSL {

  var color = Color(rgb);

  const c = color.hsl();


  debugger;

  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
      h = s = 0;
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return  { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) };
}


// export function rgbToHsl(rgb: RGBA): HSL {
//     const r1 = rgb.r / 255;
//     const g1 = rgb.g / 255;
//     const b1 = rgb.b / 255;

//     const maxColor = Math.max(r1, g1, b1);
//     const minColor = Math.min(r1, g1, b1);

//     let L = (maxColor + minColor) / 2 ;
//     let S = 0;
//     let H = 0;
//     if (maxColor != minColor) {
//         if (L < 0.5) {
//             S = (maxColor - minColor) / (maxColor + minColor);
//         } else {
//             S = (maxColor - minColor) / (2.0 - maxColor - minColor);
//         }

//         if (r1 == maxColor) {
//             H = (g1 - b1) / (maxColor - minColor);
//         } else if (g1 == maxColor) {
//             H = 2.0 + (b1 - r1) / (maxColor - minColor);
//         } else {
//             H = 4.0 + (r1 - g1) / (maxColor - minColor);
//         }
//     }

//     L = L * 255;
//     S = S * 255;
//     H = H * 255;

//     return { h: H, s: S, l: L };
// }

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToRgb(hsl: HSL): RGBA {
    var r, g, b;
    const h = hsl.h / 360;
    const s = hsl.s / 255;
    const l = hsl.l / 255;
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
  }

