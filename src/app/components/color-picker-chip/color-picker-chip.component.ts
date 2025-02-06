import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import Color from 'color';

import { isContrastYIQDark } from '../../helpers/is-contrast-yiq-dark';
import { DialogComponent } from '../dialog/dialog.component';


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
})
export class FsColorPickerChipComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() public set color(value) {
    this._color = value;
    this._updateBorder();
  }

  public get color() {
    return this._color;
  }

  @Input() public showClear = true;

  @Output()
  public changed = new EventEmitter<string>();
  
  public borderColor;

  private _onChange: (value: string | null) => void;
  private _onTouch: () => void;
  private _color: string;
  private _destroy$ = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) { }

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
    //
  }

  public ngOnInit() {
    this._updateBorder();
    this._cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public clear() {
    this.color = null;
    this._cdRef.markForCheck();
  }

  public openDialog() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: { 
        color: this._color,
        showClear: this.showClear,
      },
      minWidth: 'auto',
      panelClass: 'fs-color-picker-dialog-container',
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((result: string | null | undefined) => {
        if (result !== undefined) {
          this.color = result;
          this.changed.next(this.color);
          this._onChange(this.color);
          this._cdRef.markForCheck();
        }
      });
  }

  private _updateBorder(): void {
    this.borderColor = null;

    if (this.color) {
      const color = Color(this.color);
      if (isContrastYIQDark(color.rgb(), 220) || color.alpha() < .2) {
        this.borderColor = '#e4e4e4';
      }
    }
  }

}
