import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryUser } from '../../models/story.model';

@Component({
  selector: 'app-stories-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories-timeline.component.html',
  styleUrl: './stories-timeline.component.scss'
})
export class StoriesTimelineComponent {
  @Input() users: StoryUser[] = [];
  @Output() storySelected = new EventEmitter<string>();
  @Output() addStoryClicked = new EventEmitter<void>();

  onAvatarClick(user: StoryUser): void {
    if (user.isOwn) {
      this.addStoryClicked.emit();
    } else {
      this.storySelected.emit(user.id);
    }
  }

  hasUnseenStories(user: StoryUser): boolean {
    return user.items.some(item => !item.seen);
  }
}
