import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionsService } from '../../services/reactions.service';

@Component({
  selector: 'app-story-reactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-reactions.component.html',
  styleUrl: './story-reactions.component.scss'
})
export class StoryReactionsComponent implements OnChanges {
  @Input() currentStoryItemId = '';
  @Output() reactionTriggered = new EventEmitter<void>();

  isLiked = false;
  showDoubleTapHeart = false;
  likeAnimating = false;

  constructor(private reactionsService: ReactionsService) {}

  ngOnChanges(): void {
    this.isLiked = this.reactionsService.isLiked(this.currentStoryItemId);
  }

  onHeartClick(): void {
    this.isLiked = this.reactionsService.toggleLike(this.currentStoryItemId);
    this.likeAnimating = true;
    setTimeout(() => this.likeAnimating = false, 400);
  }

  onDoubleTap(): void {
    this.reactionsService.setLiked(this.currentStoryItemId);
    this.isLiked = true;
    this.showDoubleTapHeart = true;
    this.likeAnimating = true;

    setTimeout(() => this.likeAnimating = false, 400);
    setTimeout(() => this.showDoubleTapHeart = false, 1200);
  }
}
