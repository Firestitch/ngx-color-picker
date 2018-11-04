import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogComponent,
        ColorPaletteComponent,
        HueSliderComponent } from './components';
import { MatTabsModule, MatSliderModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatSliderModule,
    FormsModule

  ],
  exports: [
    DialogComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  declarations: [
    DialogComponent,
    HueSliderComponent,
    ColorPaletteComponent
  ],
  providers: [
    // FsComponentService,
  ],
})
export class FsComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsComponentModule,
      // providers: [FsComponentService]
    };
  }
}
