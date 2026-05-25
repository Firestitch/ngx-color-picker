import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Injector, Input, OnDestroy, OnInit, Renderer2, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';


import { FsClearModule } from '@firestitch/clear';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsColorPickerChipComponent as FsColorPickerChipComponent_1 } from '../color-picker-chip/color-picker-chip.component';

import { FsColorPickerChipComponent } from './../color-picker-chip/color-picker-chip.component';


@Component({
  selector: '[fsColorPicker]',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsColorPickerComponent),
    multi: true,
  }],
  standalone: true,
  imports: [
    NgClass,
    FsColorPickerChipComponent_1,
    FormsModule,
    FsClearModule,
  ],
})
export class FsColorPickerComponent implements
  OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild(FsColorPickerChipComponent, { static: true })
  public colorChip: FsColorPickerChipComponent;

  @Input()
  public showClear = true;

  @HostBinding('attr.tabindex')
  public tabindex = '-1';

  @HostBinding('attr.autocomplete')
  public autocomplete = 'off';

  private _isDisabled = false;
  private _dialogOpen = false;
  private _value: string;
  private _destroy$ = new Subject<void>();
  private _onChange: (value: string | null) => void;
  private _onTouch: () => void;
  private _ngControl: NgControl;
  private _injector = inject(Injector);
  private _el = inject(ElementRef);
  private _renderer2 = inject(Renderer2);
  private _cdRef = inject(ChangeDetectorRef);

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

  // Open when the field is clicked or focused so the picker is attached to the input
  // itself (including the form-field container click and the embedded swatch).
  @HostListener('focus')
  @HostListener('click')
  public openDialog() {
    // Don't open in preview mode, when disabled, or if a dialog is already open.
    if (!this._ngControl || this._isDisabled || this._dialogOpen) {
      return;
    }

    this._dialogOpen = true;

    this.colorChip.openDialog()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._dialogOpen = false;
        this._cdRef.markForCheck();
      });
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
    if (this._ngControl) {
      this._renderer2.setAttribute(this._el.nativeElement, 'readonly', 'readonly');

      const el: Element = this._getFormFieldFlex(this._el.nativeElement);
      

      if (el) {
        const wrapper = this._el.nativeElement.querySelector('.fs-color-picker-preview-wrapper');
        const prefix = document.createElement('div');
        prefix.classList.add('mat-mdc-form-field-icon-prefix');
        prefix.append(wrapper);
        el.prepend(prefix);
      }
    }
  }

  public writeValue(value: string | undefined) {
    this._value = value;
    this.updateInput();
    this._cdRef.markForCheck();
  }

  public updateInput() {
    const input = this._el.nativeElement;
    input.value = this.value || '';
    // Programmatic value changes don't emit an 'input' event, so matInput (which owns the
    // form-field's floating-label/empty state) won't notice. Dispatch one so the label
    // floats/unfloats correctly when a color is selected or cleared.
    input.dispatchEvent(new Event('input'));
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public clear(event: MouseEvent) {
    event.stopPropagation();
    this.chipChanged(null);
    this.colorChip.clear();
    // Drop focus so the now-empty field's label settles back down instead of staying floated.
    this._el.nativeElement.blur();
  }

  private _getFormFieldFlex(el: Element) {
    if (el.classList.contains('mat-mdc-form-field-flex')) {
      return el;
    }

    return el.parentElement ? this._getFormFieldFlex(el.parentElement) : null;
  }
}
