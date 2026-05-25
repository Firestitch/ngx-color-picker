import { NgModule } from '@angular/core';

import { FsColorPickerComponent } from './components/color-picker/color-picker.component';
import { FsColorPickerChipComponent } from './components/color-picker-chip/color-picker-chip.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  imports: [
    DialogComponent,
    FsColorPickerComponent,
    FsColorPickerChipComponent,
  ],
  exports: [
    DialogComponent,
    FsColorPickerComponent,
    FsColorPickerChipComponent,
  ],
})
export class FsColorPickerModule {
}
