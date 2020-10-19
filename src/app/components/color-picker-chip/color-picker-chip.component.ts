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
import { createRandomColor } from '../../helpers';
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

  @Input()
  public prepopulate = false;

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
    if (this.prepopulate && !this.color) {
      this.color = createRandomColor().hex();
      this.changed.next(this.color);
    }

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
      data: { color: this._color },
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
    let borderColor = 'efefef';

    if (this.color) {
      const color = Color(this.color);
      if (!isContrastYIQDark(color.rgb(), 235) && color.alpha() > .3) {
        borderColor = 'transparent';
      }
    }

    this.borderColor = `#${borderColor}`;
  }

}
