import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { rgbToHex } from '../../helpers';


@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent {
  public hue: Uint8ClampedArray;
  public color: Uint8ClampedArray;
  public colorHex = '';
  public colorRgb = '';
  public selectedHeight: number;
  public selectedPosition: { x: number, y: number };

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { color: string | null }) {
    this.selectedPosition = { x: Math.floor(Math.random() * 255), y: Math.floor(Math.random() * 255) };
    this.selectedHeight = Math.floor(Math.random() * 255);
  }

  public colorHueChange(color: Uint8ClampedArray) {
    this.hue = color;
  }

  public colorPaletteChange(color: Uint8ClampedArray) {
    this.color = color;
    this.colorHex = rgbToHex(color[0], color[1], color[2]);
    this.colorRgb = `rgb(${color[0]},${color[1]},${color[2]})`;
  }

  public select() {
    this.dialogRef.close(this.colorHex);
  }
}
