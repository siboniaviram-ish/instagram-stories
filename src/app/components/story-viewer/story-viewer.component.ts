import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesService } from '../../services/stories.service';
import { StoryReactionsComponent } from '../story-reactions/story-reactions.component';
import { StoryCommentsComponent } from '../story-comments/story-comments.component';

declare const Zuck: (timeline: HTMLElement, options?: any) => any;

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [CommonModule, StoryReactionsComponent, StoryCommentsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './story-viewer.component.html',
  styleUrl: './story-viewer.component.scss'
})
export class StoryViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() openStoryId: string | null = null;
  @Output() viewerClosed = new EventEmitter<void>();

  @ViewChild('storiesContainer') storiesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild(StoryReactionsComponent) reactionsComp!: StoryReactionsComponent;

  isOpen = false;
  currentStoryItemId = '';
  currentStoryUserId = '';
  commentsDrawerOpen = false;
  isPaused = false;

  private zuckInstance: any = null;
  private lastTapTime = 0;
  private swipeStartY = 0;
  private initialized = false;
  private pendingOpenId: string | null = null;
  private modalObserver: MutationObserver | null = null;

  constructor(
    private storiesService: StoriesService,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Small delay to ensure the global Zuck script has executed
    setTimeout(() => this.initZuck(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openStoryId'] && this.openStoryId) {
      if (this.zuckInstance) {
        this.openStory(this.openStoryId);
      } else {
        this.pendingOpenId = this.openStoryId;
      }
    }
  }

  ngOnDestroy(): void {
    this.zuckInstance = null;
    if (this.modalObserver) {
      this.modalObserver.disconnect();
      this.modalObserver = null;
    }
  }

  private initZuck(): void {
    if (this.initialized) return;
    if (!this.storiesContainer?.nativeElement) return;

    if (typeof Zuck === 'undefined') {
      console.error('[StoryViewer] Zuck.js is not loaded. Retrying...');
      setTimeout(() => this.initZuck(), 200);
      return;
    }

    const timeline = this.storiesService.getZuckTimeline();
    const element = this.storiesContainer.nativeElement;

    try {
      this.zone.runOutsideAngular(() => {
        this.zuckInstance = Zuck(element, {
          skin: 'snapgram',
          avatars: true,
          list: false,
          openEffect: true,
          cubeEffect: true,
          autoFullScreen: false,
          backButton: true,
          previousTap: true,
          localStorage: true,
          stories: timeline,
          callbacks: {
            onOpen: (storyId: string, callback: () => void) => {
              this.zone.run(() => {
                this.isOpen = true;
                this.currentStoryUserId = storyId;
                this.updateCurrentItem(storyId);
              });
              callback();
            },
            onClose: (storyId: string, callback: () => void) => {
              this.zone.run(() => {
                this.isOpen = false;
                this.currentStoryItemId = '';
                this.currentStoryUserId = '';
                this.viewerClosed.emit();
              });
              callback();
            },
            onView: (storyId: string) => {
              this.zone.run(() => {
                this.currentStoryUserId = storyId;
                this.updateCurrentItem(storyId);
              });
            },
            onEnd: (storyId: string, callback: () => void) => {
              callback();
            },
            onNavigateItem: (storyId: string, nextStoryId: string, callback: () => void) => {
              this.zone.run(() => {
                this.currentStoryUserId = storyId;
                setTimeout(() => this.updateCurrentItem(storyId), 100);
              });
              callback();
            }
          }
        });
      });

      this.initialized = true;
      this.setupModalObserver();
      console.log('[StoryViewer] Zuck.js initialized successfully');

      // Open any pending story
      if (this.pendingOpenId) {
        setTimeout(() => {
          this.openStory(this.pendingOpenId!);
          this.pendingOpenId = null;
        }, 200);
      }
    } catch (e) {
      console.error('[StoryViewer] Failed to initialize Zuck.js:', e);
    }
  }

  private openStory(storyId: string): void {
    if (!this.zuckInstance) {
      console.warn('[StoryViewer] openStory called but zuckInstance is null');
      return;
    }

    // Use the zuck.js modal API directly via the #zuck-modal element
    const modalEl = document.querySelector('#zuck-modal') as any;
    if (modalEl?.modal) {
      modalEl.modal.show(storyId);
      return;
    }

    // Fallback: click the story element in the zuck timeline
    const storyEl = this.storiesContainer.nativeElement.querySelector(
      `[data-id="${storyId}"]`
    ) as HTMLElement;
    if (storyEl) {
      storyEl.click();
    } else {
      console.warn('[StoryViewer] Could not find story element for:', storyId);
    }
  }

  private updateCurrentItem(storyId: string): void {
    const modal = document.querySelector('#zuck-modal');
    if (!modal) return;

    const activeSlide = modal.querySelector('.story-viewer.viewing .slides .item.active');
    if (activeSlide) {
      const itemId = activeSlide.getAttribute('data-item-id');
      if (itemId) {
        this.currentStoryItemId = itemId;
      }
    } else {
      // Fallback: use the first item of the story
      const user = this.storiesService.getUserById(storyId);
      if (user && user.items.length > 0) {
        this.currentStoryItemId = user.items[0].id;
      }
    }
  }

  private setupModalObserver(): void {
    const modal = document.querySelector('#zuck-modal');
    if (!modal) return;

    this.modalObserver = new MutationObserver(() => {
      this.applyFiltersToActiveSlide();
    });
    this.modalObserver.observe(modal, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private applyFiltersToActiveSlide(): void {
    const modal = document.querySelector('#zuck-modal');
    if (!modal) return;

    const activeSlide = modal.querySelector('.story-viewer.viewing .slides .item.active');
    if (!activeSlide) return;

    const itemId = activeSlide.getAttribute('data-item-id');
    if (!itemId) return;

    const filterMap = this.storiesService.getFilterMap();
    const cssFilter = filterMap[itemId];

    const media = activeSlide.querySelector('img, video') as HTMLElement;
    if (media) {
      media.style.filter = cssFilter || '';
    }
  }

  onOverlayTap(event: MouseEvent | TouchEvent): void {
    const now = Date.now();
    if (now - this.lastTapTime < 300) {
      event.preventDefault();
      event.stopPropagation();
      if (this.reactionsComp) {
        this.reactionsComp.onDoubleTap();
      }
      this.lastTapTime = 0;
    } else {
      this.lastTapTime = now;
    }
  }

  onSwipeStart(event: TouchEvent): void {
    this.swipeStartY = event.touches[0].clientY;
  }

  onSwipeEnd(event: TouchEvent): void {
    const deltaY = this.swipeStartY - event.changedTouches[0].clientY;
    if (deltaY > 80 && !this.commentsDrawerOpen) {
      this.commentsDrawerOpen = true;
    }
  }

  onCommentInputFocused(): void {
    this.pauseStory();
  }

  onCommentInputBlurred(): void {
    this.resumeStory();
  }

  onCommentSent(): void {
    this.resumeStory();
  }

  onCommentsDrawerChanged(open: boolean): void {
    this.commentsDrawerOpen = open;
    if (open) {
      this.pauseStory();
    } else {
      this.resumeStory();
    }
  }

  private pauseStory(): void {
    this.isPaused = true;
    const video = document.querySelector('#zuck-modal video') as HTMLVideoElement;
    if (video) video.pause();
    const progress = document.querySelector('#zuck-modal .story-viewer .slides .item.active .progress');
    if (progress) {
      (progress as HTMLElement).style.animationPlayState = 'paused';
    }
  }

  private resumeStory(): void {
    this.isPaused = false;
    const video = document.querySelector('#zuck-modal video') as HTMLVideoElement;
    if (video) video.play();
    const progress = document.querySelector('#zuck-modal .story-viewer .slides .item.active .progress');
    if (progress) {
      (progress as HTMLElement).style.animationPlayState = 'running';
    }
  }
}
