import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterStripComponent } from '../filter-strip/filter-strip.component';
import { AdjustmentSlidersComponent } from '../adjustment-sliders/adjustment-sliders.component';
import { FilterPreset } from '../../models/filter.model';
import { StoriesService } from '../../services/stories.service';

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
}

@Component({
  selector: 'app-story-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterStripComponent, AdjustmentSlidersComponent],
  templateUrl: './story-editor.component.html',
  styleUrl: './story-editor.component.scss'
})
export class StoryEditorComponent implements OnDestroy {
  @Output() editorClosed = new EventEmitter<void>();
  @Output() storyPosted = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  mediaSrc = '';
  mediaType: 'image' | 'video' = 'image';
  selectedFilter: FilterPreset = { name: 'Original', cssFilter: 'none' };
  adjustmentFilter = '';
  filterToastName = '';
  filterToastVisible = false;
  overlays: TextOverlay[] = [];
  showTextInput = false;
  showEmojiPicker = false;
  newText = '';
  private objectUrl = '';
  private toastTimer: any = null;
  private draggingOverlay: TextOverlay | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  readonly emojis = [
    '❤️', '🔥', '😍', '😂', '🥰', '✨', '🎉', '💯',
    '🙌', '👏', '🤩', '😎', '🥳', '💪', '⭐', '🌟',
    '🎵', '🦋', '🌈', '☀️', '🌙', '💫', '🍕', '🎸'
  ];

  constructor(private storiesService: StoriesService) {}

  ngOnDestroy(): void {
    this.revokeMedia();
  }

  get combinedFilter(): string {
    const parts: string[] = [];
    if (this.selectedFilter.cssFilter !== 'none') {
      parts.push(this.selectedFilter.cssFilter);
    }
    if (this.adjustmentFilter) {
      parts.push(this.adjustmentFilter);
    }
    return parts.length ? parts.join(' ') : 'none';
  }

  triggerUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.revokeMedia();
    this.objectUrl = URL.createObjectURL(file);
    this.mediaSrc = this.objectUrl;
    this.mediaType = file.type.startsWith('video/') ? 'video' : 'image';
  }

  onFilterSelected(preset: FilterPreset): void {
    this.selectedFilter = preset;
    this.showFilterToast(preset.name);
  }

  private showFilterToast(name: string): void {
    if (name === 'Original') return;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.filterToastName = name;
    this.filterToastVisible = true;
    this.toastTimer = setTimeout(() => {
      this.filterToastVisible = false;
    }, 2000);
  }

  onAdjustmentChanged(filter: string): void {
    this.adjustmentFilter = filter;
  }

  addText(): void {
    this.showEmojiPicker = false;
    this.showTextInput = true;
    this.newText = '';
  }

  confirmText(): void {
    if (this.newText.trim()) {
      this.overlays.push({
        id: 'txt-' + Date.now(),
        text: this.newText.trim(),
        x: 100,
        y: 150,
        fontSize: 24
      });
    }
    this.showTextInput = false;
    this.newText = '';
  }

  cancelText(): void {
    this.showTextInput = false;
    this.newText = '';
  }

  toggleEmojiPicker(): void {
    this.showTextInput = false;
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string): void {
    this.overlays.push({
      id: 'emo-' + Date.now(),
      text: emoji,
      x: 120 + Math.random() * 80,
      y: 120 + Math.random() * 80,
      fontSize: 48
    });
    this.showEmojiPicker = false;
  }

  onOverlayDragStart(event: MouseEvent, overlay: TextOverlay): void {
    event.preventDefault();
    this.draggingOverlay = overlay;
    const previewEl = (event.target as HTMLElement).closest('.editor-preview')!;
    const rect = previewEl.getBoundingClientRect();
    this.dragOffsetX = event.clientX - rect.left - overlay.x;
    this.dragOffsetY = event.clientY - rect.top - overlay.y;

    const onMove = (e: MouseEvent) => {
      if (!this.draggingOverlay) return;
      const r = previewEl.getBoundingClientRect();
      this.draggingOverlay.x = e.clientX - r.left - this.dragOffsetX;
      this.draggingOverlay.y = e.clientY - r.top - this.dragOffsetY;
    };
    const onUp = () => {
      this.draggingOverlay = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  onOverlayTouchStart(event: TouchEvent, overlay: TextOverlay): void {
    const touch = event.touches[0];
    this.draggingOverlay = overlay;
    const previewEl = (event.target as HTMLElement).closest('.editor-preview')!;
    const rect = previewEl.getBoundingClientRect();
    this.dragOffsetX = touch.clientX - rect.left - overlay.x;
    this.dragOffsetY = touch.clientY - rect.top - overlay.y;

    const onMove = (e: TouchEvent) => {
      if (!this.draggingOverlay) return;
      const t = e.touches[0];
      const r = previewEl.getBoundingClientRect();
      this.draggingOverlay.x = t.clientX - r.left - this.dragOffsetX;
      this.draggingOverlay.y = t.clientY - r.top - this.dragOffsetY;
    };
    const onEnd = () => {
      this.draggingOverlay = null;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }

  post(): void {
    if (!this.mediaSrc) return;

    const id = 'user-' + Date.now();
    this.storiesService.addStoryItem({
      id,
      type: this.mediaType,
      src: this.mediaSrc,
      preview: this.mediaSrc,
      duration: this.mediaType === 'video' ? 15 : 5,
      time: Date.now() / 1000,
      seen: false,
      cssFilter: this.combinedFilter !== 'none' ? this.combinedFilter : undefined
    });

    this.storyPosted.emit();
    this.editorClosed.emit();
  }

  cancel(): void {
    this.revokeMedia();
    this.editorClosed.emit();
  }

  private revokeMedia(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = '';
    }
  }
}
