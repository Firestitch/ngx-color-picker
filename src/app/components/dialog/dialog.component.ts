import { Component } from '@angular/core';

@Component({
  selector: 'color-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  public hue: Array<any>;
  public color;
  public colorHex = '';
  public colorRgb = '';
  public selectedHeight;
  public selectedPosition;

  constructor() {
    this.selectedPosition = { x: Math.floor(Math.random() * 255), y: Math.floor(Math.random() * 255) };
    this.selectedHeight = Math.floor(Math.random() * 255);
  }

  public colorHueChange(color) {
    this.hue = color;
  }

  public colorPaletteChange(color) {
    this.color = color;
    this.colorHex = '#' + this.fullColorHex(color[0],color[1],color[2]);
    this.colorRgb = `rgb(${color[0]},${color[1]},${color[2]})`;
  }

  fullColorHex(r,g,b) {
    var red = this.rgbToHex(r);
    var green = this.rgbToHex(g);
    var blue = this.rgbToHex(b);
    return red+green+blue;
  }

  rgbToHex (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  }
}
