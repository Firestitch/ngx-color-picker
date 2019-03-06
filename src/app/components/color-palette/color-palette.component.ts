import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  HostListener
} from '@angular/core';

import { hslToRgb } from '../../helpers/color-helper';
import { HSL } from '../../interfaces/hsl';
import { RGBA } from '../../interfaces/rgba';

@Component({
  selector: 'cp-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css']
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
  @Input() selectedPosition: { x: number; y: number };
  @Input() hsl: HSL;
  @Output() changed: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('handle') public handleCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('palette') public paletteCanvas: ElementRef<HTMLCanvasElement>;

  private rect: ClientRect;
  private palette: CanvasRenderingContext2D;
  private handle: CanvasRenderingContext2D;
  private mousedown = false;

  @HostListener('window:mouseup', ['$event'])
  public onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(evt: MouseEvent) {
   this.mouseMove(evt);
  }

  public ngAfterViewInit() {
    this.draw();
    this.drawHandle();
  }

  public ngOnChanges(changes: SimpleChanges) {

    if (changes.hsl) {
      this.draw();

      if (!this.selectedPosition) {
        this.selectedPosition = { x: 0, y: 0 };
      }

      this.drawHandle();
    }
  }

  public draw() {

    if (!this.palette) {
      this.palette = this.paletteCanvas.nativeElement.getContext('2d');
    }

    if (!this.handle) {
      this.handle = this.handleCanvas.nativeElement.getContext('2d');
    }

    const width = this.paletteCanvas.nativeElement.width;
    const height = this.paletteCanvas.nativeElement.height;
    const hsl = Object.assign({}, this.hsl, { s: 255, l: 128 });
    this.palette.clearRect(0, 0, width, height);
    this.palette.fillStyle = this.getRgba(hsl) || 'rgba(255,255,255,1)';
    this.palette.fillRect(0, 0, width, height);

    const whiteGrad = this.palette.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.palette.fillStyle = whiteGrad;
    this.palette.fillRect(0, 0, width, height);

    const blackGrad = this.palette.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.palette.fillStyle = blackGrad;
    this.palette.fillRect(0, 0, width, height);
  }

  public drawHandle() {
    if (this.selectedPosition) {

      this.handle = this.handleCanvas.nativeElement.getContext('2d');
      const width = this.handleCanvas.nativeElement.width;
      const height = this.handleCanvas.nativeElement.height;

      this.handle.clearRect(0, 0, width, height);
      this.handle.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.handle.beginPath();
      this.handle.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
      this.handle.lineWidth = 5;
      this.handle.stroke();
    }
  }

  public canvasMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.rect = this.paletteCanvas.nativeElement.getBoundingClientRect();
    this.onMouseMove(evt);
  }

  public getRgbAtPosition(x: number, y: number): RGBA {
    const data = this.palette.getImageData(x, y, 1, 1).data;
    return { r: data[0], g: data[1], b: data[2] };
  }

  public getRgba(hsl) {
    if (!hsl) {
      return '';
    }
    const rgb = hslToRgb(hsl);
    return `rgb(${rgb.r},${rgb.g},${rgb.b},1)`;
  }

  private mouseMove(event) {
    if (this.mousedown) {

      event.stopPropagation();
      event.preventDefault();

      const top = this.rect.top;
      const left = this.rect.left;

      const height = top + this.paletteCanvas.nativeElement.height;
      const width = left + this.paletteCanvas.nativeElement.width;

      let y = event.pageY;
      let x = event.pageX;

      if (event.pageY < top) {
        y = top;
      }

      if (event.pageY > (height)) {
        y = height;
      }

      if (event.pageX < left) {
        x = left;
      }

      if (event.pageX > (width)) {
        x = width - 1;
      }

      x = this.handleCanvas.nativeElement.width - (width - x);
      y = this.handleCanvas.nativeElement.height - (height - y);

      this.selectedPosition = { x, y };

      this.drawHandle();
      const hsl = this.hsl;

      let s = x / 255;
      const h = 1 - (y / 255);
      const l = (h / 2) * (2 - s);
      s = (h * s) / (1 - Math.abs(2 * l - 1));

      hsl.s = (s * 255) || 0;
      hsl.l = l * 255;

      this.changed.emit(hsl);
    }
  }
}
