import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPreset, FILTER_PRESETS } from '../../models/filter.model';

@Component({
  selector: 'app-filter-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-strip.component.html',
  styleUrl: './filter-strip.component.scss'
})
export class FilterStripComponent implements OnChanges {
  @Input() mediaSrc = '';
  @Input() isVideo = false;
  @Output() filterSelected = new EventEmitter<FilterPreset>();

  presets = FILTER_PRESETS;
  activeIndex = 0;
  thumbnailSrc = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mediaSrc'] || changes['isVideo']) {
      if (this.isVideo && this.mediaSrc) {
        this.captureVideoFrame(this.mediaSrc);
      } else {
        this.thumbnailSrc = this.mediaSrc;
      }
    }
  }

  selectFilter(preset: FilterPreset, index: number): void {
    this.activeIndex = index;
    this.filterSelected.emit(preset);
  }

  private captureVideoFrame(src: string): void {
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.currentTime = 0.5;
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 72;
      canvas.height = 72;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 72, 72);
        this.thumbnailSrc = canvas.toDataURL('image/jpeg', 0.6);
      }
      video.remove();
    }, { once: true });
  }
}
