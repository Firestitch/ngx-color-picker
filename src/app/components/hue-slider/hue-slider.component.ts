import { Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-hue-slider',
  templateUrl: './hue-slider.component.html',
  styleUrls: ['./hue-slider.component.css']
})
export class HueSliderComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @Output() color: EventEmitter<any> = new EventEmitter();
  @Input() selectedHeight: number;
  public value = 0;
  public rect;
  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean = false;

  ngAfterViewInit() {
    this.draw();
    this.drawHandle();
    this.emitColor(this.selectedHeight);
  }

  draw() {
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

  drawHandle() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    this.ctx.lineWidth = 3;
    this.ctx.rect(0, this.selectedHeight - 3, this.canvas.nativeElement.width, 5);
    this.ctx.stroke();
    this.ctx.closePath();
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

      const height = top + this.canvas.nativeElement.height;

      var y = evt.pageY;

      if(evt.pageY < top) {
        y = top;
      }

      if(evt.pageY > (height)) {
        y = height;
      }

      this.selectedHeight = this.canvas.nativeElement.height - (height - y);

      this.draw();
      this.emitColor(this.selectedHeight);

      this.drawHandle();
    }
  }

  emitColor(y: number) {
    const rgbaColor = this.getColorAtPosition(y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(y: number) {
    return this.ctx.getImageData(15, y, 1, 1).data;
  }
}
