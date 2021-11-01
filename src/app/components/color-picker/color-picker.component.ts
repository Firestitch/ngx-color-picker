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
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { Subject } from 'rxjs';

import { createRandomColor } from '../../helpers';


@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FsColorPickerComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild(FsColorPickerChipComponent, { static: true })
  public colorChip: FsColorPickerChipComponent;

  @Input()
  public showClear = true;

  @Input()
  public prepopulate = false;

  @HostBinding('attr.tabindex')
  public tabindex = '-1';

  @HostBinding('attr.autocomplete')
  public autocomplete = 'off';

  private _isDisabled = false;
  private _value: string = void 0;
  private _destroy$ = new Subject<void>();
  private _onChange: (value: string | null) => void;
  private _onTouch: () => void;

  constructor(
    @Optional() private _ngControl: NgControl,
    private _el: ElementRef,
    private _renderer2: Renderer2,
    private _cdRef: ChangeDetectorRef,
  ) {
    this._ngControl.valueAccessor = this;
  }

  public get value() {
    return this._value;
  }

  public get isDisabled() {
    return this._isDisabled;
  }

  public set value(value: string) {
    this._value = value;

    this._onChange(value);
    this._onTouch();
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
    // If in preview mode
    if (!this._ngControl) {
      this.showClear = false;
      this._isDisabled = true;
    }

    if (this.prepopulate && !this._ngControl.value) {
      setTimeout(() => {
        this.value = createRandomColor().hex();
        this._cdRef.markForCheck();
      });
    }

    this._cdRef.markForCheck();
  }

  public ngAfterViewInit() {
    if (this._ngControl) {
      this._renderer2.setAttribute(this._el.nativeElement, 'readonly', 'readonly');
      const wrapper = this._el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
      this._el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', wrapper);
    }
  }

  public writeValue(value: string | undefined) {
    this._value = value;

    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: any) {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this._isDisabled = isDisabled;
    this._cdRef.markForCheck();
  }

  public chipChanged(color) {
    this.value = color;
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
}
