import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { rgbToHEX, hexToRGB, rgbToHSL } from '../../helpers/color-helper';
import { RGBA } from 'src/app/interfaces/rgba';


@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public paletteColor = null;
  public sliderColor = null;
  public colorHex = '';
  public colorRgb = '';
  public contrastColor = '';
  public brightness = 100;
  public color: RGBA;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {

    let color: RGBA = { r: 0, g: 0, b: 0 };

    if (typeof this.data.color === 'string') {
      color = hexToRGB(this.data.color);
    }

    if (!color) {
      color = { r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256) };
    }

    this.colorChange(color);

    this.sliderColor = color;
    this.paletteColor = color;
  }

  public rgbChanged() {

  }

  public hexChanged() {
    const rgb = hexToRGB(this.colorHex);
    if (rgb) {
      this.paletteColor = rgb;
      this.sliderColor = rgb;
      this.colorChange(rgb);
    }
  }

  public colorSliderChange(rgb) {
    this.paletteColor = rgb;
    this.colorChange(rgb);
  }

  public colorPaletteChange(rgb) {
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb. b);
    this.brightness = hsl.l;

    this.colorChange(rgb);
  }

  public colorChange(rgb) {
    this.color = rgb;
    this.colorHex = rgbToHEX(rgb.r, rgb.g, rgb.b);
    this.colorRgb = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    this.contrastColor = this.isContrastYIQDark(rgb) ? '#474747' : '#fff';
  }

  private isContrastYIQDark(rgb) {
    const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return yiq >= 180;
  }

  public select() {
    this.dialogRef.close(rgbToHEX(this.color.r, this.color.g, this.color.b));
  }
}
