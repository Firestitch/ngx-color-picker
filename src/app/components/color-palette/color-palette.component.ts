import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  HostListener,
  OnInit, ChangeDetectionStrategy
} from '@angular/core';

import Color from 'color';

@Component({
  selector: 'cp-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent implements OnInit, OnChanges {
  @Input() selectedPosition: { x: number; y: number };
  @Input() color: Color;
  @Output() changed: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('handle', { static: true }) public handleCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorLayer', { static: true }) public colorLayer: ElementRef;

  public colorStyle: any = {};
  private rect: ClientRect;
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

  public ngOnInit() {
    this.drawHandle();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      if (!this.selectedPosition) {
        this.selectedPosition = { x: 0, y: 0 };
      }

      const hsv = this.color.hsv();
      this.selectedPosition = { x: (hsv.color[1] / 100) * 255, y: 255 - ((hsv.color[2] / 100) * 255) };

      const background = Color(this.color).hsv();
      background.color[1] = 100;
      background.color[2] = 100;

      this.colorStyle.background = background.hex();

      this.drawHandle();
    }
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
    this.rect = this.colorLayer.nativeElement.getBoundingClientRect();
    this.onMouseMove(evt);
  }

  private mouseMove(event) {
    if (this.mousedown) {

      event.stopPropagation();
      event.preventDefault();

      const top = this.rect.top;
      const left = this.rect.left;

      const height = top + this.colorLayer.nativeElement.clientHeight;
      const width = left + this.colorLayer.nativeElement.clientWidth;

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

      const hsl = this.color.hsl();

      let s = x / 255;
      const h = 1 - (y / 255);
      const l = (h / 2) * (2 - s);
      s = (h * s) / (1 - Math.abs(2 * l - 1));

      hsl.color[1] = (s * 100) || 0;
      hsl.color[2] = l * 100;

      this.color = hsl;
      this.changed.emit(this.color);
    }
  }
}
