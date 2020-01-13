import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FsColorPickerComponent implements AfterViewInit {

  @Input() public ngModel: string | null = null;
  @Output() public ngModelChange = new EventEmitter<string>();

  public icon = 'settings';

  constructor(private _dialog: MatDialog,
              private el: ElementRef,
              private renderer2: Renderer2) {
  }

  @HostBinding('attr.tabindex') tabindex = '-1';
  @HostBinding('attr.autocomplete') autocomplete = 'off';

  @HostListener('click', ['$event'])
  public inputClick($event: Event) {
    if (!this.ngModel) {
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
    }
    this.openDialog();
  }

  public ngAfterViewInit() {

    this.renderer2.setAttribute(this.el.nativeElement, 'readonly', 'readonly');
    const wrapper = this.el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
    this.el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', wrapper);
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
