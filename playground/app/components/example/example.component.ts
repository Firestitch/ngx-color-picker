import { Component } from '@angular/core';
import { randomColor } from '@firestitch/colorpicker';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent {

  public color = null;
  //public color = randomColor();

}
