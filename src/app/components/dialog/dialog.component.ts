import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { rgbToHEX } from '../../helpers/color-helper';


@Component({
  selector: 'cp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public hue: Uint8ClampedArray;
  public color = null;
  public colorHex = '';
  public colorRgb = '';
  public selectedHeight: number;
  public selectedPosition: { x: number, y: number };

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.selectedPosition = { x: Math.floor(Math.random() * 255), y: Math.floor(Math.random() * 255) };
    this.selectedHeight = Math.floor(Math.random() * 255);
  }

  public ngOnInit() {
    this.color = this.data.color;
  }

  public colorHueChange(color: Uint8ClampedArray) {
    this.hue = color;
  }

  public colorPaletteChange(color: Uint8ClampedArray) {
    this.colorHex = rgbToHEX(color[0], color[1], color[2]);
    this.colorRgb = `rgb(${color[0]},${color[1]},${color[2]})`;
  }

  public select() {
    this.dialogRef.close(this.colorHex);
  }
}
