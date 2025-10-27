import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsColorPickerComponent } from '../../../../src/app/components/color-picker/color-picker.component';

@Component({
    selector: 'example',
    templateUrl: './example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        FsColorPickerComponent,
    ],
})
export class ExampleComponent {

  public color = null;

}
