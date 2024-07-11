import { ChangeDetectionStrategy, Component } from '@angular/core';
import { randomColor } from '@firestitch/colorpicker';

@Component({
  selector: 'chip-example',
  templateUrl: './chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {

  public color = randomColor();

}
