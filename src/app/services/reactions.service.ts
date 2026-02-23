import { Injectable } from '@angular/core';
import { Comment, Like } from '../models/story.model';

@Injectable({ providedIn: 'root' })
export class ReactionsService {
  private readonly LIKES_KEY = 'ig_stories_likes';
  private readonly COMMENTS_KEY = 'ig_stories_comments';

  getLikes(): Record<string, boolean> {
    const data = localStorage.getItem(this.LIKES_KEY);
    return data ? JSON.parse(data) : {};
  }

  isLiked(storyItemId: string): boolean {
    return this.getLikes()[storyItemId] === true;
  }

  toggleLike(storyItemId: string): boolean {
    const likes = this.getLikes();
    likes[storyItemId] = !likes[storyItemId];
    localStorage.setItem(this.LIKES_KEY, JSON.stringify(likes));
    return likes[storyItemId];
  }

  setLiked(storyItemId: string): boolean {
    const likes = this.getLikes();
    if (likes[storyItemId]) return false; // already liked
    likes[storyItemId] = true;
    localStorage.setItem(this.LIKES_KEY, JSON.stringify(likes));
    return true;
  }

  getComments(storyId: string): Comment[] {
    const all = this.getAllComments();
    return all.filter(c => c.storyId === storyId);
  }

  addComment(storyId: string, text: string): Comment {
    const all = this.getAllComments();
    const comment: Comment = {
      id: 'comment-' + Date.now(),
      storyId,
      userId: 'your-story',
      username: 'You',
      avatar: 'https://i.pravatar.cc/150?img=1',
      text,
      time: Date.now()
    };
    all.push(comment);
    localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(all));
    return comment;
  }

  private getAllComments(): Comment[] {
    const data = localStorage.getItem(this.COMMENTS_KEY);
    return data ? JSON.parse(data) : [];
  }
}
