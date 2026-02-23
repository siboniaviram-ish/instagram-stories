import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesTimelineComponent } from './components/stories-timeline/stories-timeline.component';
import { StoryViewerComponent } from './components/story-viewer/story-viewer.component';
import { StoryEditorComponent } from './components/story-editor/story-editor.component';
import { StoriesService } from './services/stories.service';
import { StoryUser } from './models/story.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StoriesTimelineComponent, StoryViewerComponent, StoryEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  users: StoryUser[] = [];
  selectedStoryId: string | null = null;
  showEditor = false;

  constructor(private storiesService: StoriesService) {}

  ngOnInit(): void {
    this.users = this.storiesService.getUsers();
  }

  onStorySelected(userId: string): void {
    this.selectedStoryId = userId;
  }

  onViewerClosed(): void {
    this.selectedStoryId = null;
  }

  onAddStory(): void {
    this.showEditor = true;
  }

  onEditorClosed(): void {
    this.showEditor = false;
  }

  onStoryPosted(): void {
    this.users = [...this.storiesService.getUsers()];
  }
}
