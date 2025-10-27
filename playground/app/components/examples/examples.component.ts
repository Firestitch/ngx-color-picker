import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { ExampleComponent } from '../example/example.component';
import { ChipComponent } from '../chip/chip.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, ExampleComponent, ChipComponent]
})
export class ExamplesComponent {
  public config = environment;
}
