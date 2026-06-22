import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatIconButton } from '@angular/material/button';

import { Subject } from 'rxjs';


import { FsColorChipComponent } from '../color-chip/color-chip.component';


@Component({
  selector: 'fs-color-picker-chip',
  templateUrl: './color-picker-chip.component.html',
  styleUrls: ['./color-picker-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsColorPickerChipComponent),
    multi: true,
  }],
  standalone: true,
  imports: [FsColorChipComponent, MatIconButton],
})
export class FsColorPickerChipComponent implements OnDestroy, ControlValueAccessor {

  @ViewChild(FsColorChipComponent) public colorChip: FsColorChipComponent;

  @Input() public set color(value) {
    this._color = value;
  }

  public get color() {
    return this._color;
  }

  @Input() public showClear = true;

  /**
   * When false, clicking the chip does not open the dialog on its own. Used when the
   * chip is embedded in the form-field directive, which drives opening via input focus.
   */
  @Input() public clickable = true;

  @Output()
  public changed = new EventEmitter<string>();
  
  public borderColor;

  private _onChange: (value: string | null) => void;
  private _onTouch: () => void;
  private _color: string;
  private _destroy$ = new Subject<void>();
  private _cdRef = inject(ChangeDetectorRef);

  public writeValue(color): void {
    this.color = color;
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    // isDisabled is not used
  }

  public chipClick() {
    this.colorChip.openDialog()
      .subscribe((result: string | null | undefined) => {
        if (result !== undefined) {
          this.color = result;
          this.changed.next(this.color);
          this._onChange(this.color);
          this._cdRef.markForCheck();
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public clear() {
    this.color = null;
    this._cdRef.markForCheck();
  }

}
