import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactionsService } from '../../services/reactions.service';
import { Comment } from '../../models/story.model';

@Component({
  selector: 'app-story-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './story-comments.component.html',
  styleUrl: './story-comments.component.scss'
})
export class StoryCommentsComponent implements OnChanges {
  @Input() currentStoryItemId = '';
  @Input() drawerOpen = false;
  @Output() drawerOpenChange = new EventEmitter<boolean>();
  @Output() inputFocused = new EventEmitter<void>();
  @Output() inputBlurred = new EventEmitter<void>();
  @Output() commentSent = new EventEmitter<void>();

  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;

  commentText = '';
  comments: Comment[] = [];

  private touchStartY = 0;

  constructor(private reactionsService: ReactionsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStoryItemId']) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.comments = this.reactionsService.getComments(this.currentStoryItemId);
  }

  onInputFocus(): void {
    this.inputFocused.emit();
  }

  onInputBlur(): void {
    if (!this.commentText.trim()) {
      this.inputBlurred.emit();
    }
  }

  sendComment(): void {
    if (!this.commentText.trim()) return;
    this.reactionsService.addComment(this.currentStoryItemId, this.commentText.trim());
    this.commentText = '';
    this.loadComments();
    this.commentSent.emit();
    if (this.commentInput) {
      this.commentInput.nativeElement.blur();
    }
  }

  openDrawer(): void {
    this.drawerOpen = true;
    this.drawerOpenChange.emit(true);
    this.loadComments();
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.drawerOpenChange.emit(false);
  }

  onDrawerTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onDrawerTouchEnd(event: TouchEvent): void {
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;
    if (deltaY > 80) {
      this.closeDrawer();
    }
  }

  formatTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendComment();
    }
  }
}
