import { HostListener, Input, Output, EventEmitter, Component, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.css']
})

export class FsColorPickerComponent implements AfterViewInit {
  @Input() public ngModel: string | null = null;
  @Output() public ngModelChange = new EventEmitter<string>();

  public icon = 'settings';

  constructor(private _dialog: MatDialog,
              private el: ElementRef) {}

  @HostListener('click', ['$event'])
  public inputClick($event: Event) {
    if (!this.ngModel) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.openDialog();
  }

  public ngAfterViewInit() {
    this.el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', this.el.nativeElement.querySelector('.fs-color-picker-preview-wrapper'));
  }

  public clear() {
    this.ngModelChange.emit(null);
  }

  public openDialog() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: { color: this.ngModel },
      panelClass: 'fs-color-picker-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result) {
        this.ngModelChange.emit(result);
      }
    });
  }
}
