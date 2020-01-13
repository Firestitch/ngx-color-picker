import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { FsClearModule } from '@firestitch/clear';

import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { FsColorPickerComponent } from './components/color-picker/color-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HueSliderComponent } from './components/hue-slider/hue-slider.component';


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
  /*static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsColorPickerModule
    };
  }*/
}
