import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]',
  standalone: true
})
export class LongPressDirective {
  @Output() longPressStart = new EventEmitter<void>();
  @Output() longPressEnd = new EventEmitter<void>();

  private pressing = false;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onPress(): void {
    this.timeout = setTimeout(() => {
      this.pressing = true;
      this.longPressStart.emit();
    }, 200);
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  @HostListener('mouseleave')
  onRelease(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.pressing) {
      this.pressing = false;
      this.longPressEnd.emit();
    }
  }
}
