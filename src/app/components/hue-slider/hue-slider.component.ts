import { takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import Color from 'color';

@Component({
  selector: 'cp-hue-slider',
  templateUrl: './hue-slider.component.html',
  styleUrls: ['./hue-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HueSliderComponent implements OnInit, OnDestroy {

  @Input()
  public color: Color;

  @Output()
  public changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('colorCanvas', { static: true })
  public colorCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('colorHandle', { static: true })
  public colorHandle: ElementRef<HTMLCanvasElement>;

  @ViewChild('alphaCanvas', { static: true })
  public alphaCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('alphaHandle', { static: true })
  public alphaHandle: ElementRef<HTMLCanvasElement>;

  public height = 255;
  public width = 30;
  public colorTop;
  public alphaTop;

  private _colorDragging = false;
  private _alphaDragging = false;
  private ctx: CanvasRenderingContext2D;
  private alphaContext: CanvasRenderingContext2D;
  private _destroy$ = new Subject();

  constructor() {

    fromEvent(window, 'mouseup')
      .pipe(
        takeUntil(this._destroy$),
      ).subscribe(() => {
        this._colorDragging = false;
        this._alphaDragging = false;
      });

    fromEvent(window, 'mousemove')
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((event: any) => {
        if (this._colorDragging) {
          this.colorMove(event.clientY - this.colorCanvas.nativeElement.getBoundingClientRect().top);
        }

        if (this._alphaDragging) {
          this.alphaMove(event.clientY - this.alphaCanvas.nativeElement.getBoundingClientRect().top);
        }
      });
  }

  public ngOnInit() {
    this.colorTop = `${(this.color.hsl().hue() / 360) * this.height}px`;
    this.alphaTop = `${(1 - this.color.alpha()) * this.height}px`;
    this.draw();
  }

  public draw() {
    this.drawColor();
    this.drawAlpha();
  }

  public drawColor() {
    this.ctx = this.colorCanvas.nativeElement.getContext('2d');

    const width = this.colorCanvas.nativeElement.width;
    const height = this.colorCanvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawAlpha() {
    this.alphaContext = this.alphaCanvas.nativeElement.getContext('2d');

    const hueGrd = this.alphaContext.createLinearGradient(90, 0.000, 90, this.height);

    hueGrd.addColorStop(0.01,	'rgba(' + this.color.red() + ',' + this.color.green() + ',' + this.color.blue() + ', 1.000)');
    hueGrd.addColorStop(0.99, 'rgba(' + this.color.red() + ',' + this.color.green() + ',' + this.color.blue() + ', 0.000)');

    this.alphaContext.clearRect(0, 0, 30, this.height);
    this.alphaContext.fillStyle = hueGrd;
    this.alphaContext.fillRect(0, 0, 30, this.height);
  }

  public colorMouseDown(event: MouseEvent) {
    this._colorDragging = true;
    this.colorMove(event.offsetY);
  }

  public colorMove(height) {
    if (height < 0) {
      height = 0;
    } else if (height > 255) {
      height = 255;
    }

    this.color = this.color.hsl();
    this.color.color[0] = ((height) / this.height) * 360;
    this.drawAlpha();
    this.colorHandle.nativeElement.style.top = `${height}px`;
    this.changed.emit(this.color);
  }

  public alphaMove(height) {
    if (height < 0) {
      height = 0;
    } else if (height > 255) {
      height = 255;
    }

    const alpha = Math.round((1 - (height / this.height)) * 100) / 100;
    this.color = this.color.alpha(alpha);
    this.alphaHandle.nativeElement.style.top = `${height}px`;
    this.changed.emit(this.color);
  }

  public alphaMouseDown(event: MouseEvent) {
    this._alphaDragging = true;
    this.alphaMove(event.offsetY);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
