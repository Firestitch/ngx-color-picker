import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FsClearModule } from '@firestitch/clear';

import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { FsColorPickerComponent } from './components/color-picker/color-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HueSliderComponent } from './components/hue-slider/hue-slider.component';
import { FsColorPickerChipComponent } from './components/color-picker-chip/color-picker-chip.component';


@NgModule({
  imports: [
    FormsModule,

    CommonModule,
    DragDropModule,

    MatTabsModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    FsClearModule
  ],
  exports: [
    DialogComponent,
    FsColorPickerComponent,
    FsColorPickerChipComponent
  ],
  entryComponents: [
    DialogComponent,
  ],
  declarations: [
    DialogComponent,
    FsColorPickerChipComponent,
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
