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
  style?: 'text' | 'location' | 'hashtag' | 'mention' | 'music';
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

  // Sticker tool states
  activePrompt: 'location' | 'hashtag' | 'mention' | 'music' | null = null;
  promptInput = '';

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

  readonly locationSuggestions = [
    'Tel Aviv, Israel', 'New York, NY', 'Los Angeles, CA', 'London, UK',
    'Paris, France', 'Tokyo, Japan', 'Dubai, UAE', 'Barcelona, Spain'
  ];

  readonly musicSuggestions = [
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'Stay', artist: 'The Kid LAROI, Justin Bieber' },
    { title: 'Peaches', artist: 'Justin Bieber' },
    { title: 'Montero', artist: 'Lil Nas X' },
    { title: 'Good 4 U', artist: 'Olivia Rodrigo' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Save Your Tears', artist: 'The Weeknd' }
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
    // Force destroy the @if block so the CSS animation restarts
    this.filterToastVisible = false;
    setTimeout(() => {
      this.filterToastName = name;
      this.filterToastVisible = true;
      this.toastTimer = setTimeout(() => {
        this.filterToastVisible = false;
      }, 2000);
    });
  }

  onAdjustmentChanged(filter: string): void {
    this.adjustmentFilter = filter;
  }

  // --- Text ---
  addText(): void {
    this.closeAllPanels();
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
        fontSize: 24,
        style: 'text'
      });
    }
    this.showTextInput = false;
    this.newText = '';
  }

  cancelText(): void {
    this.showTextInput = false;
    this.newText = '';
  }

  // --- Emoji ---
  toggleEmojiPicker(): void {
    this.closeAllPanels();
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

  // --- Location ---
  openLocationPicker(): void {
    this.closeAllPanels();
    this.activePrompt = 'location';
    this.promptInput = '';
  }

  selectLocation(location: string): void {
    this.overlays.push({
      id: 'loc-' + Date.now(),
      text: '📍 ' + location,
      x: 60,
      y: 80,
      fontSize: 16,
      style: 'location'
    });
    this.activePrompt = null;
    this.promptInput = '';
  }

  confirmPromptAsLocation(): void {
    if (this.promptInput.trim()) {
      this.selectLocation(this.promptInput.trim());
    }
  }

  get filteredLocations(): string[] {
    if (!this.promptInput.trim()) return this.locationSuggestions;
    const q = this.promptInput.toLowerCase();
    return this.locationSuggestions.filter(l => l.toLowerCase().includes(q));
  }

  // --- Hashtag ---
  openHashtagInput(): void {
    this.closeAllPanels();
    this.activePrompt = 'hashtag';
    this.promptInput = '';
  }

  confirmHashtag(): void {
    let tag = this.promptInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = '#' + tag;
    this.overlays.push({
      id: 'tag-' + Date.now(),
      text: tag,
      x: 80,
      y: 120,
      fontSize: 22,
      style: 'hashtag'
    });
    this.activePrompt = null;
    this.promptInput = '';
  }

  // --- Mention ---
  openMentionInput(): void {
    this.closeAllPanels();
    this.activePrompt = 'mention';
    this.promptInput = '';
  }

  confirmMention(): void {
    let name = this.promptInput.trim();
    if (!name) return;
    if (!name.startsWith('@')) name = '@' + name;
    this.overlays.push({
      id: 'men-' + Date.now(),
      text: name,
      x: 80,
      y: 160,
      fontSize: 20,
      style: 'mention'
    });
    this.activePrompt = null;
    this.promptInput = '';
  }

  // --- Music ---
  openMusicPicker(): void {
    this.closeAllPanels();
    this.activePrompt = 'music';
    this.promptInput = '';
  }

  selectMusic(title: string, artist: string): void {
    this.overlays.push({
      id: 'mus-' + Date.now(),
      text: '🎵 ' + title + ' — ' + artist,
      x: 40,
      y: 200,
      fontSize: 14,
      style: 'music'
    });
    this.activePrompt = null;
    this.promptInput = '';
  }

  get filteredMusic(): { title: string; artist: string }[] {
    if (!this.promptInput.trim()) return this.musicSuggestions;
    const q = this.promptInput.toLowerCase();
    return this.musicSuggestions.filter(
      m => m.title.toLowerCase().includes(q) || m.artist.toLowerCase().includes(q)
    );
  }

  // --- Common ---
  closeAllPanels(): void {
    this.showTextInput = false;
    this.showEmojiPicker = false;
    this.activePrompt = null;
    this.promptInput = '';
  }

  cancelPrompt(): void {
    this.activePrompt = null;
    this.promptInput = '';
  }

  // --- Drag ---
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

  // --- Post ---
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
