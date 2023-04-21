import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';

import { FsColorPickerChipComponent } from './../color-picker-chip/color-picker-chip.component';


@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsColorPickerComponent),
    multi: true
  }]  
})
export class FsColorPickerComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild(FsColorPickerChipComponent, { static: true })
  public colorChip: FsColorPickerChipComponent;

  @Input()
  public showClear = true;

  @HostBinding('attr.tabindex')
  public tabindex = '-1';

  @HostBinding('attr.autocomplete')
  public autocomplete = 'off';

  private _isDisabled = false;
  private _value: string = void 0;
  private _destroy$ = new Subject<void>();
  private _onChange: (value: string | null) => void;
  private _onTouch: () => void;
  private _ngControl: NgControl;

  constructor(
    private _injector: Injector,
    private _el: ElementRef,
    private _renderer2: Renderer2,
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  public get value() {
    return this._value;
  }

  public set value(value: string) {
    this._value = value;
    this.updateInput();
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
    this._ngControl = this._injector.get(NgControl);
    // If in preview mode
    if (!this._ngControl) {
      this.showClear = false;
      this._isDisabled = true;
    }

    this._cdRef.markForCheck();
  }

  public ngAfterViewInit() {
    if(this._ngControl) {
      this._renderer2.setAttribute(this._el.nativeElement, 'readonly', 'readonly');
      const wrapper = this._el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
      this._el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', wrapper);
    }
  }

  public writeValue(value: string | undefined) {
    this._value = value;
    this.updateInput();
    this._cdRef.markForCheck();
  }

  public updateInput() {
    this._el.nativeElement.value = this.value || '';
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
    this._onChange(color);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clear(event: MouseEvent) {
    event.stopPropagation();
    this.chipChanged(null);
    this.colorChip.clear();
  }

  public openDialog() {
    if (this._isDisabled) {
      return;
    }

    this.colorChip.openDialog();
  }
}
