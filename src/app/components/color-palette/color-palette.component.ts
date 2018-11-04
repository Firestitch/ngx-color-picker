import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, SimpleChanges, OnChanges, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css']
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {

  @Input() hue: string;
  rect;

  @Output() color: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  private mousedown: boolean = false;

  @Input() selectedPosition: { x: number; y: number };

  ngAfterViewInit() {
    this.draw();
    this.drawHandle();
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.fillStyle = this.getRgba(this.hue) || 'rgba(255,255,255,1)';
    this.ctx.fillRect(0, 0, width, height);

    const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.ctx.fillStyle = whiteGrad;
    this.ctx.fillRect(0, 0, width, height);

    const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.ctx.fillStyle = blackGrad;
    this.ctx.fillRect(0, 0, width, height);
  }

  drawHandle() {
    if (this.selectedPosition) {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.beginPath();
      this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
      this.ctx.lineWidth = 5;
      this.ctx.stroke();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hue']) {
      this.draw();
      const pos = this.selectedPosition;
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
      }

      this.drawHandle();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  canvasMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.rect = this.canvas.nativeElement.getBoundingClientRect();
    this.onMouseMove(evt);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {

      evt.stopPropagation();
      evt.preventDefault();

      const top = this.rect.top;
      const left = this.rect.left;

      const height = top + this.canvas.nativeElement.height;
      const width = left + this.canvas.nativeElement.width;

      var y = evt.pageY;
      var x = evt.pageX;

      if(evt.pageY < top) {
        y = top;
      }

      if(evt.pageY > (height)) {
        y = height;
      }

      if(evt.pageX < left) {
        x = left;
      }

      if(evt.pageX > (width)) {
        x = width - 1;
      }

      x = this.canvas.nativeElement.width - (width - x);
      y = this.canvas.nativeElement.height - (height - y);

      this.selectedPosition = { x: x, y: y }

      this.draw();
      this.emitColor(x, y);
      this.drawHandle();
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number) {
    return this.ctx.getImageData(x, y, 1, 1).data;
  }

  getRgba(data) {
    if (!data) {
      return '';
    }
    return 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
  }
}
