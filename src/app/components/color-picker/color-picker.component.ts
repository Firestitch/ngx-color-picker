import { FsColorPickerChipComponent } from './../color-picker-chip/color-picker-chip.component';
import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogComponent } from '../dialog/dialog.component';
import { createRandomColor } from '../../helpers';


@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FsColorPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(FsColorPickerChipComponent,{ static: true })
  public colorChip: FsColorPickerChipComponent;

  @Input()
  public showClear = true;

  @Input()
  public ngModel;

  @Input()
  public prepopulate = false;

  @Input()
  public set value(value: string) {
    this._value = value;

    if (this._ngControl) {
      this._ngControl.control.markAsTouched();
      this._ngControl.control.markAsDirty();

      this._ngControl.control.setValue(value);
    }

    this._cdRef.detectChanges();
  }

  @HostBinding('attr.tabindex')
  public tabindex = '-1';

  @HostBinding('attr.autocomplete')
  public autocomplete = 'off';

  private _isDisabled = false;
  private _value: string = void 0;
  private _destroy$ = new Subject<void>();

  constructor(
    @Optional() private _ngControl: NgControl,
    private _el: ElementRef,
    private _renderer2: Renderer2,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public get value() {
    return this._value;
  }

  public get isDisabled() {
    return this._isDisabled;
  }

  @HostListener('click', ['$event'])
  public inputClick($event: Event) {
    // To prevent open dialog if used in preview mode or disabled
    if (!this._ngControl || this._isDisabled) {
      return
    }

    if (!this.value) {
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
    }

    this.openDialog();
  }

  public ngOnInit() {
    this._listenValueChanges();

    // If in preview mode
    if (!this._ngControl) {
      this.showClear = false;
      this._isDisabled = true;
    }

    if (this.prepopulate && !this.ngModel) {
      setTimeout(() => {
        this.value = createRandomColor().hex();
      });
    }

    this._cdRef.detectChanges();
  }

  public ngAfterViewInit() {
    if (this._ngControl) {
      this._renderer2.setAttribute(this._el.nativeElement, 'readonly', 'readonly');
      const wrapper = this._el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
      this._el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', wrapper);
    }
  }

  public chipChanged(color) {
    this.value = color;
    this._cdRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clear(event: MouseEvent) {
    event.stopPropagation();
    this.value = null;
    this.colorChip.clear();
  }

  public openDialog() {
    if (this._isDisabled) {
      return;
    }

    this.colorChip.openDialog();
  }

  private _listenValueChanges() {
    if (this._ngControl) {
      this._ngControl.valueChanges
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe((value) => {
          this._value = value;

          this._cdRef.detectChanges();
        });
    }
  }
}
