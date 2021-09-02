import { HueSliderComponent } from './../hue-slider/hue-slider.component';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Color from 'color';
import { isContrastYIQDark } from '../../helpers/is-contrast-yiq-dark';
import { createRandomColor } from '../../helpers';

@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {

  @ViewChild(HueSliderComponent, { static: true })
  public hueSlider: HueSliderComponent;

  public paletteColor = null;
  public colorHex = '';
  public colorRgb = '';
  public contrastColor = '';
  public color = Color();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  public ngOnInit() {
    if (typeof this.data.color === 'string' && this.data.color !== '') {
      this.setColor(this.data.color);
    } else {
      this.setColor(createRandomColor());
    }

    this.paletteColor = this.color;
  }

  public setColor(color) {
    this.color = Color(color);
    this.colorHex = this.getHex();
    this.colorRgb = this.color.rgb().toString();
    this.contrastColor = isContrastYIQDark(this.color.rgb()) ? '#474747' : '#fff';
  }

  public alphaToHex(alpha) {
    if (alpha >= 1 || alpha < 0 || isNaN(alpha)) {
      return '';
    }

    return Math.ceil(255 * alpha).toString(16).toUpperCase();
  }

  public rgbChanged() {
    const match = this.colorRgb.match(/rgb\(\d+\s*,\s*\d+\s*,\s*\d+\s*\)/i);
    if (match) {
      this.setColor(this.colorRgb);
      this.paletteColor = this.color;
    }
  }

  public hexChanged() {
    const match = this.colorHex.match(/^#?([0-9A-Fa-f]{6}|([0-9A-Fa-f]{8}))$/);
    if (match) {
      this.setColor(this.colorHex);
      this.paletteColor = this.color;
    }
  }

  public sliderChanged(color) {
    this.setColor(color);
    this.paletteColor = color;
  }

  public paletteChanged(color) {
    this.setColor(color);
    this.hueSlider.drawAlpha();
  }

  public clear() {
    this.dialogRef.close(null);
  }

  public select() {
    this.dialogRef.close(this.getHex());
  }

  public getHex() {
    let hex = this.color.hex();

    if (this.color.alpha() < 1) {
      let alpha = this.alphaToHex(this.color.alpha());

      if (alpha.length === 1) {
        alpha = `0${alpha}`;
      }

      hex = hex.concat(alpha);
    }

    return hex;
  }
}
