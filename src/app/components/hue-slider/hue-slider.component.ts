import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  HostListener,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit
} from '@angular/core';

import { rgbToHSL, hslToRgb } from '../../helpers/color-helper';
import { RGBA } from 'src/app/interfaces/rgba';

@Component({
  selector: 'cp-hue-slider',
  templateUrl: './hue-slider.component.html',
  styleUrls: ['./hue-slider.component.css']
})
export class HueSliderComponent implements AfterViewInit, OnChanges {
  @Input() color: RGBA;
  //@Input() brightness = 100;
  @Output() colorChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('handle') handle: ElementRef<HTMLCanvasElement>;

  private selectedHeight: number;
  private rect: ClientRect;
  private ctx: CanvasRenderingContext2D;
  private canvasHandle: CanvasRenderingContext2D;
  private hsvMax = 360;
  private mousedown = false;

  constructor() {}

  public ngAfterViewInit() {
    this.draw();
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.color) {
      //const hsl = rgbToHSL(this.color.r, this.color.g, this.color.b);
      //this.brightness = hsl.l;
    }

    this.getPositionByColor();
    this.drawHandle();
  }

  @HostListener('window:mouseup', ['$event'])
  public onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(evt: MouseEvent) {
    this.mouseMove(evt);
  }

  public draw() {

    this.ctx = this.canvas.nativeElement.getContext('2d');

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

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

  public drawHandle() {

    this.canvasHandle = this.handle.nativeElement.getContext('2d');
    const width = this.handle.nativeElement.width;
    const height = this.handle.nativeElement.height;

    this.canvasHandle.clearRect(0, 0, width, height);
    this.canvasHandle.beginPath();
    this.canvasHandle.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    this.canvasHandle.lineWidth = 3;
    this.canvasHandle.rect(0, this.selectedHeight - 3, this.canvas.nativeElement.width, 5);
    this.canvasHandle.stroke();
    this.canvasHandle.closePath();
  }

  public canvasMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.rect = this.canvas.nativeElement.getBoundingClientRect();
    this.onMouseMove(evt);
  }

  public emitColor(y: number) {
    const rgbaColor = this.getColorAtPosition(y);
    this.colorChanged.emit(rgbaColor);
  }

  public getColorAtPosition(y: number) {
    const hsl = rgbToHSL(this.color.r, this.color.g, this.color.b);
    hsl.h = (y / 255) * 100;
    return hslToRgb(hsl.h / 100, hsl.s / 100, hsl.l / 100);
  }

  private mouseMove(event: MouseEvent) {
    if (this.mousedown) {

      event.stopPropagation();
      event.preventDefault();

      const top = this.rect.top;

      const height = top + this.canvas.nativeElement.height;

      let y = event.pageY;

      if (event.pageY < top) {
        y = top;
      }

      if (event.pageY > (height)) {
        y = height;
      }

      this.selectedHeight = this.canvas.nativeElement.height - (height - y);
      this.emitColor(this.selectedHeight);
      this.drawHandle();
    }
  }

  /**
   * Function for getting position by hex-color
   */
  public getPositionByColor() {
    const height = this.canvas.nativeElement.height;
    const hsvColor = rgbToHSL(this.color.r, this.color.g, this.color.b);
    this.selectedHeight = hsvColor.h * height / this.hsvMax;
  }
}
