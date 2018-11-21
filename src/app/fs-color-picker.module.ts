import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { FsColorPickerComponent } from './components/color-picker/color-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HueSliderComponent } from './components/hue-slider/hue-slider.component';

import {  MatTabsModule,
          MatSliderModule,
          MatDialogModule,
          MatIconModule,
          MatButtonModule } from '@angular/material';
import { FsClearModule } from '@firestitch/clear';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    FsClearModule
  ],
  exports: [
    DialogComponent,
    FsColorPickerComponent
  ],
  entryComponents: [
    DialogComponent,
  ],
  declarations: [
    DialogComponent,
    HueSliderComponent,
    ColorPaletteComponent,
    FsColorPickerComponent
  ]
})
export class FsColorPickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsColorPickerModule
    };
  }
}
