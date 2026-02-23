import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adjustment-sliders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adjustment-sliders.component.html',
  styleUrl: './adjustment-sliders.component.scss'
})
export class AdjustmentSlidersComponent {
  @Output() adjustmentChanged = new EventEmitter<string>();

  expanded = false;
  brightness = 100;
  contrast = 100;
  saturation = 100;

  toggle(): void {
    this.expanded = !this.expanded;
  }

  onSliderChange(): void {
    this.adjustmentChanged.emit(this.getAdjustmentFilter());
  }

  reset(): void {
    this.brightness = 100;
    this.contrast = 100;
    this.saturation = 100;
    this.adjustmentChanged.emit('');
  }

  getAdjustmentFilter(): string {
    const parts: string[] = [];
    if (this.brightness !== 100) parts.push(`brightness(${this.brightness / 100})`);
    if (this.contrast !== 100) parts.push(`contrast(${this.contrast / 100})`);
    if (this.saturation !== 100) parts.push(`saturate(${this.saturation / 100})`);
    return parts.join(' ');
  }
}
