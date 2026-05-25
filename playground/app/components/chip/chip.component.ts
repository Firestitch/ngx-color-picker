import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { FsColorPickerChipComponent } from '../../../../src/app/components/color-picker-chip/color-picker-chip.component';

@Component({
  selector: 'chip-example',
  templateUrl: './chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FsColorPickerChipComponent, FormsModule],
})
export class ChipComponent {

  public color;
  chipChanged(d) {}
}
