import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Color from 'color';
import { createRandomColor } from '../../helpers';

@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {
  public paletteColor = null;
  public colorHex = '';
  public colorRgb = '';
  public contrastColor = '';
  public color = Color();

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

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
    this.colorHex = this.color.hex();
    this.colorRgb = this.color.rgb().toString();
    this.contrastColor = this.isContrastYIQDark(this.color.rgb()) ? '#474747' : '#fff';
  }

  public rgbChanged() {
    const match = this.colorRgb.match(/rgb\(\d+\s*,\s*\d+\s*,\s*\d+\s*\)/i);
    if (match) {
      this.setColor(this.colorRgb);
      this.paletteColor = this.color;
    }
  }

  public hexChanged() {
    const match = this.colorHex.match(/^#?[0-9A-Fa-f]{6}$/);
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
  }

  private isContrastYIQDark(rgb) {
    const yiq = ((rgb.red() * 299) + (rgb.green() * 587) + (rgb.blue() * 114)) / 1000;
    return yiq >= 180;
  }

  public select() {
    this.dialogRef.close(this.color.hex().toString());
  }
}
