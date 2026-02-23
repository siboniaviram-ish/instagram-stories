export interface StoryItem {
  id: string;
  type: 'image' | 'video' | 'text';
  src?: string;
  preview?: string;
  duration: number;
  text?: string;
  gradient?: string;
  time: number;
  seen: boolean;
  cssFilter?: string;
}

export interface StoryUser {
  id: string;
  name: string;
  photo: string;
  lastUpdated: number;
  isOwn: boolean;
  items: StoryItem[];
}

export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  time: number;
}

export interface Like {
  storyItemId: string;
  liked: boolean;
}
