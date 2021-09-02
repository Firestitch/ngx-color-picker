import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {

  public color = '';

  public change(color): void {
    console.log(color);
  }

}
