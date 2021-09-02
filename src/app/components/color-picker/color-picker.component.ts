import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, forwardRef, HostBinding, HostListener,
  Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';

import { FsColorPickerChipComponent } from './../color-picker-chip/color-picker-chip.component';
import { createRandomColor } from '../../helpers';


@Component({
  selector: '[fsColorPicker]',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsColorPickerComponent),
      multi: true
    }
  ],  
})
export class FsColorPickerComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild(FsColorPickerChipComponent,{ static: true })
  public colorChip: FsColorPickerChipComponent;

  @Input()
  public showClear = true;

  @Input()
  public prepopulate = false;

  @HostBinding('attr.tabindex')
  public tabindex = '-1';

  @HostBinding('attr.autocomplete')
  public autocomplete = 'off';

  public color;
  private _isDisabled = false;
  private _destroy$ = new Subject<void>();

  private _onTouched = () => { };
  private _onChange = (value: any) => {};

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }

  public constructor(
    @Inject(ElementRef) private _el: ElementRef,
    private _renderer2: Renderer2,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public get isDisabled() {
    return this._isDisabled;
  }

  @HostListener('click', ['$event'])
  public inputClick(event: Event) {
    //To prevent open dialog if used in preview mode or disabled
    if (this._isDisabled) {
      return
    }

    if (!this.color) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    this.openDialog();
  }

  public ngOnInit() {
    if (this.prepopulate && !this.color) {
      this.color = createRandomColor().hex();
      this._onChange(this.color);      
      this._cdRef.detectChanges();
    }
  }

  public ngAfterViewInit() {
    this._renderer2.setAttribute(this._el.nativeElement, 'readonly', 'readonly');
    const wrapper = this._el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
    this._el.nativeElement.parentElement.parentElement.insertAdjacentElement('afterbegin', wrapper);
  }

  public writeValue(value: any): void {
    this.color = value;
  }

  public chipChanged(color) {
    this.color = color;
    this._onChange(color);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clear(event: MouseEvent) {
    event.stopPropagation();
    this.color = null;
    this.colorChip.clear();
  }

  public openDialog() {
    if (this._isDisabled) {
      return;
    }

    this.colorChip.openDialog();
  }
}
