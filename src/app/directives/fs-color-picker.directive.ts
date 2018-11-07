import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../components/dialog/dialog.component';

@Directive({
  selector: '[fsColorPicker]',
})

export class FsColorPickerDirective {
  @Input() public ngModel: string | null = null;
  @Output() public ngModelChange = new EventEmitter<string>();

  constructor(private _dialog: MatDialog) { }

  @HostListener('click', ['$event'])
  public inputClick() {
    this.openDialog();
  }

  public openDialog() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: { color: this.ngModel }
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result) {
        this.ngModelChange.emit(result);
      }
    });
  }
}
