import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { rgbToHex, hexToRgb, rgbToHsl, hslToRgb } from '../../helpers/color-helper';
import { RGBA } from '../../interfaces/rgba';
import { HSL } from '../../interfaces/hsl';


@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public paletteHsl = null;
  public sliderHsl = null;
  public colorHex = '';
  public colorRgb = '';
  public contrastColor = '';
  public hsl: HSL;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {

    let hsl: HSL = null;

    if (typeof this.data.color === 'string') {

      const rgb: RGBA = hexToRgb(this.data.color);
      if (rgb) {
        hsl = rgbToHsl(rgb);
      }
    }

    if (!hsl) {
      hsl = { h: Math.floor(Math.random() * 256),
              l: Math.floor(Math.random() * 256),
              s: Math.floor(Math.random() * 256) };
    }

    this.setHsl(hsl);
    this.sliderHsl = hsl;
    this.paletteHsl = hsl;
  }

  public rgbChanged() {

  }

  public hexChanged() {
    const rgb = hexToRgb(this.colorHex);
    if (rgb) {

      const hsl = rgbToHsl(rgb);
      this.setHsl(hsl);
    }
  }

  public sliderChanged(hue) {

    const hsl = this.hsl;
    hsl.h = hue;
    this.setHsl(hsl);
    this.paletteHsl = Object.assign({}, hsl);
  }

  public paletteChanged(hsl) {
    hsl.h = this.hsl.h;
    this.setHsl(hsl);
  }

  public setHsl(hsl: HSL) {
    this.hsl = hsl;
    const rgb = hslToRgb(hsl);
    this.colorHex = rgbToHex(rgb);
    this.colorRgb = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    this.contrastColor = this.isContrastYIQDark(rgb) ? '#474747' : '#fff';
  }

  private isContrastYIQDark(rgb) {
    const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return yiq >= 180;
  }

  public select() {
    const rgb = hslToRgb(this.hsl)
    const hex = rgbToHex(rgb);
    this.dialogRef.close(hex);
  }
}
