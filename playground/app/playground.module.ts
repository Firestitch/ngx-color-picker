import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ChipComponent } from './components/chip/chip.component';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';

import { AppComponent } from './app.component';
import { ExampleComponent, ExamplesComponent } from './components';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FsColorPickerModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        FormsModule,
        FsLabelModule,
        FsExampleModule.forRoot(),
        RouterModule.forRoot(routes, {}),
    ],
    declarations: [
        AppComponent,
        ExamplesComponent,
        ExampleComponent,
        ChipComponent
    ],
    providers: []
})
export class PlaygroundModule {
}
