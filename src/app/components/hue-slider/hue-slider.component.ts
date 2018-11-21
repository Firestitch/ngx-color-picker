import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  HostListener,
  EventEmitter,
  Input,
  OnInit,
  AfterViewChecked
} from '@angular/core';

import { hexToRGB, rgbToHSL } from '../../helpers/color-helper';

@Component({
  selector: 'cp-hue-slider',
  templateUrl: './hue-slider.component.html',
  styleUrls: ['./hue-slider.component.css']
})
export class HueSliderComponent implements AfterViewInit, AfterViewChecked {
  @Input() selectedHeight: number;
  @Input() color: string;
  @Output() colorChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  private rect: ClientRect;
  private ctx: CanvasRenderingContext2D;

  private mousedown = false;

  constructor() {}

  public ngAfterViewInit() {
    this.draw();

    // if color is selected
    if (this.color) {
      this.getPositionByColor();
      const rgb = hexToRGB(this.color);
      this.colorChanged.emit([rgb.r, rgb.g, rgb.b, 255]);
    } else {
      this.emitColor(this.selectedHeight);
    }

    this.drawHandle();
  }

  public ngAfterViewChecked() {
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
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
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
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.lineWidth = 3;
    this.ctx.rect(0, this.selectedHeight - 3, this.canvas.nativeElement.width, 5);
    this.ctx.stroke();
    this.ctx.closePath();
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
    return this.ctx.getImageData(15, y, 1, 1).data;
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
      this.draw();
      this.emitColor(this.selectedHeight);
      this.drawHandle();
    }
  }

  /**
   * Function for getting position by hex-color
   */
  public getPositionByColor() {
    const height = this.canvas.nativeElement.height;
    const hsvMax = 360;

    const rgbColor = hexToRGB(this.color);
    const hsvColor = rgbToHSL(rgbColor.r, rgbColor.g, rgbColor.b);
    this.selectedHeight = hsvColor.hue * height / hsvMax;
  }
}
