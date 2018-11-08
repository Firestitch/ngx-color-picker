import { HostListener, Input, Output, EventEmitter, Component, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: '[fsColorPicker]',
  template: '<span><div class="preview" *ngIf="ngModel" [ngStyle]="{ background: ngModel }" (click)="openDialog()"></div></span>',
  styleUrls: ['fs-color-picker.component.css']
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

  ngAfterViewInit() {
    this.el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', this.el.nativeElement.children[0]);
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
