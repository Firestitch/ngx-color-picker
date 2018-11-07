import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogComponent,
        ColorPaletteComponent,
        HueSliderComponent } from './components';
import { MatTabsModule, MatSliderModule, MatDialogModule , MatButtonModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FsColorPickerDirective } from './directives/';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule

  ],
  exports: [
    DialogComponent,
    FsColorPickerDirective
  ],
  entryComponents: [
    DialogComponent,
  ],
  declarations: [
    DialogComponent,
    HueSliderComponent,
    ColorPaletteComponent,
    FsColorPickerDirective
  ],
  providers: [
    // FsComponentService,
  ],
})
export class FsColorPickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsColorPickerModule,
      // providers: [FsComponentService]
    };
  }
}
