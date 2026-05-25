import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

import Color from 'color';
import { isContrastYIQDark } from '../../helpers/is-contrast-yiq-dark';
import { HueSliderComponent } from './../hue-slider/hue-slider.component';
import { isHexValue } from '../../helpers/is-hex-value';
import { FormsModule } from '@angular/forms';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { HueSliderComponent as HueSliderComponent_1 } from '../hue-slider/hue-slider.component';
import { ColorSwatchesComponent } from '../color-swatches/color-swatches.component';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'cp-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
        FormsModule,
        ColorPaletteComponent,
        HueSliderComponent_1,
        ColorSwatchesComponent,
        MatButton,
        MatDialogClose,
    ],
})
export class DialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<DialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


  @ViewChild(HueSliderComponent, { static: true })
  public hueSlider: HueSliderComponent;

  @ViewChild(MatTabGroup, { static: true })
  private _tabGroup: MatTabGroup;

  public paletteColor = null;
  public selectedTab = 0;
  public colorHex = '';
  public colorRgb = '';
  public contrastColor = '';
  public showClear = false;
  public color = Color();

  public ngOnInit() {
    const color = this.data.color || '#000000';
    this.showClear = this.data.showClear;
    this.setColor(color);
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
    let hex = this.colorHex;

    if (isHexValue(hex)) {
      if (!this.colorHex.startsWith('#')) {
        hex = `#${this.colorHex}`;
      }

      this.setColor(hex);
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

  public swatchSelected(color) {
    this.setColor(color);
    this.select();
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

  public pasted(event: ClipboardEvent) {
    if (this._tabGroup.selectedIndex !== 0) {
      return;
    }

    event.preventDefault();

    let insertion = event.clipboardData.getData('text');

    if (isHexValue(insertion)) {
      if (!insertion.startsWith('#')) {
        insertion = `#${insertion}`;
      }

      this.colorHex = insertion;
      this.hexChanged();
    }
  }
}
