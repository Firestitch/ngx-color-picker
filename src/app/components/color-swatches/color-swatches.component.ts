import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import { ColorPalette, COLOR_PALETTES } from './color-swatches.data';

@Component({
  selector: 'cp-color-swatches',
  templateUrl: './color-swatches.component.html',
  styleUrls: ['./color-swatches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
  ],
})
export class ColorSwatchesComponent {
  @Output() public selected = new EventEmitter<string>();

  public palettes: ColorPalette[] = COLOR_PALETTES;
  public selectedPalette: ColorPalette = COLOR_PALETTES[0];

  public selectColor(color: string) {
    this.selected.emit(color);
  }
}
