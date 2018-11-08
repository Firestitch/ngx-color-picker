import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogComponent,
        ColorPaletteComponent,
        HueSliderComponent,
        FsColorPickerComponent } from './components';
import {  MatTabsModule,
          MatSliderModule,
          MatDialogModule,
          MatIconModule,
          MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
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
