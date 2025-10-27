import { ChangeDetectionStrategy, Component } from '@angular/core';
import { randomColor } from '@firestitch/colorpicker';
import { FsColorPickerChipComponent } from '../../../../src/app/components/color-picker-chip/color-picker-chip.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'chip-example',
    templateUrl: './chip.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsColorPickerChipComponent, FormsModule],
})
export class ChipComponent {

  public color = randomColor();
  chipChanged(d) {}
}
