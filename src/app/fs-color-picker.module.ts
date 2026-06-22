import { NgModule } from '@angular/core';

import { FsColorChipComponent } from './components/color-chip';
import { FsColorPickerChipComponent } from './components/color-picker-chip/color-picker-chip.component';
import { FsColorPickerComponent } from './components/color-picker/color-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  imports: [
    DialogComponent,
    FsColorPickerComponent,
    FsColorPickerChipComponent,
    FsColorChipComponent,
  ],
  exports: [
    DialogComponent,
    FsColorPickerComponent,
    FsColorPickerChipComponent,
    FsColorChipComponent,
  ],
})
export class FsColorPickerModule {
}
