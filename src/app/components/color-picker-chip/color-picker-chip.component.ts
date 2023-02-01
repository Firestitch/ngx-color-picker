import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import Color from 'color';

import { DialogComponent } from '../dialog/dialog.component';
import { isContrastYIQDark } from '../../helpers/is-contrast-yiq-dark';


@Component({
  selector: 'fs-color-picker-chip',
  templateUrl: 'color-picker-chip.component.html',
  styleUrls: ['color-picker-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsColorPickerChipComponent implements OnInit, OnDestroy {

  @Input() public set color(value) {
    this._color = value;
    this._updateBorder();
  }

  @Input() public showClear = true;

  @Output()
  public changed = new EventEmitter<string>();

  public borderColor;

  private _color: string = void 0;
  private _destroy$ = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit() {
    this._updateBorder();
    this._cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public clear() {
    this.color = null;
    this._cdRef.markForCheck();
  }

  public get color() {
    return this._color;
  }

  public openDialog() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: { 
        color: this._color,
        showClear: this.showClear,
      },
      panelClass: 'fs-color-picker-dialog-container'
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((result: string | null | undefined) => {
        if (result !== undefined) {
          this.color = result;
          this.changed.next(this.color);
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
