import { Injectable } from '@angular/core';
import { StoryItem, StoryUser } from '../models/story.model';

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private users: StoryUser[] = [
    {
      id: 'your-story',
      name: 'Your Story',
      photo: 'https://i.pravatar.cc/150?img=1',
      lastUpdated: Date.now() / 1000 - 3600,
      isOwn: true,
      items: [
        {
          id: 'your-1',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=100',
          preview: 'https://picsum.photos/1080/1920?random=100',
          duration: 5,
          time: Date.now() / 1000 - 3600,
          seen: false
        }
      ]
    },
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      photo: 'https://i.pravatar.cc/150?img=5',
      lastUpdated: Date.now() / 1000 - 7200,
      isOwn: false,
      items: [
        {
          id: 'sarah-1',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=1',
          preview: 'https://picsum.photos/1080/1920?random=1',
          duration: 5,
          time: Date.now() / 1000 - 7200,
          seen: false
        },
        {
          id: 'sarah-2',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=2',
          preview: 'https://picsum.photos/1080/1920?random=2',
          duration: 5,
          time: Date.now() / 1000 - 5400,
          seen: false
        },
        {
          id: 'sarah-3',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=3',
          preview: 'https://picsum.photos/1080/1920?random=3',
          duration: 5,
          time: Date.now() / 1000 - 3600,
          seen: false
        }
      ]
    },
    {
      id: 'alex-rivera',
      name: 'Alex Rivera',
      photo: 'https://i.pravatar.cc/150?img=12',
      lastUpdated: Date.now() / 1000 - 10800,
      isOwn: false,
      items: [
        {
          id: 'alex-1',
          type: 'text',
          text: 'Just landed in Tokyo! 🇯🇵',
          gradient: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743)',
          duration: 5,
          time: Date.now() / 1000 - 10800,
          seen: false
        },
        {
          id: 'alex-2',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=4',
          preview: 'https://picsum.photos/1080/1920?random=4',
          duration: 5,
          time: Date.now() / 1000 - 7200,
          seen: false
        }
      ]
    },
    {
      id: 'maria-lopez',
      name: 'Maria Lopez',
      photo: 'https://i.pravatar.cc/150?img=23',
      lastUpdated: Date.now() / 1000 - 14400,
      isOwn: false,
      items: [
        {
          id: 'maria-1',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=5',
          preview: 'https://picsum.photos/1080/1920?random=5',
          duration: 5,
          time: Date.now() / 1000 - 14400,
          seen: false
        },
        {
          id: 'maria-2',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=6',
          preview: 'https://picsum.photos/1080/1920?random=6',
          duration: 5,
          time: Date.now() / 1000 - 10800,
          seen: false
        },
        {
          id: 'maria-3',
          type: 'text',
          text: 'Monday motivation 💪',
          gradient: 'linear-gradient(135deg, #6a11cb, #8e44ad, #9b59b6)',
          duration: 5,
          time: Date.now() / 1000 - 7200,
          seen: false
        }
      ]
    },
    {
      id: 'james-wilson',
      name: 'James Wilson',
      photo: 'https://i.pravatar.cc/150?img=33',
      lastUpdated: Date.now() / 1000 - 18000,
      isOwn: false,
      items: [
        {
          id: 'james-1',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=7',
          preview: 'https://picsum.photos/1080/1920?random=7',
          duration: 5,
          time: Date.now() / 1000 - 18000,
          seen: false
        },
        {
          id: 'james-2',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=8',
          preview: 'https://picsum.photos/1080/1920?random=8',
          duration: 5,
          time: Date.now() / 1000 - 14400,
          seen: false
        }
      ]
    },
    {
      id: 'emma-davis',
      name: 'Emma Davis',
      photo: 'https://i.pravatar.cc/150?img=44',
      lastUpdated: Date.now() / 1000 - 21600,
      isOwn: false,
      items: [
        {
          id: 'emma-1',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=9',
          preview: 'https://picsum.photos/1080/1920?random=9',
          duration: 5,
          time: Date.now() / 1000 - 21600,
          seen: false
        },
        {
          id: 'emma-2',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=10',
          preview: 'https://picsum.photos/1080/1920?random=10',
          duration: 5,
          time: Date.now() / 1000 - 18000,
          seen: false
        },
        {
          id: 'emma-3',
          type: 'text',
          text: 'Coffee first ☕',
          gradient: 'linear-gradient(135deg, #2980b9, #3498db, #1abc9c)',
          duration: 5,
          time: Date.now() / 1000 - 14400,
          seen: false
        },
        {
          id: 'emma-4',
          type: 'image',
          src: 'https://picsum.photos/1080/1920?random=11',
          preview: 'https://picsum.photos/1080/1920?random=11',
          duration: 5,
          time: Date.now() / 1000 - 10800,
          seen: false
        }
      ]
    }
  ];

  getUsers(): StoryUser[] {
    return this.users;
  }

  getUserById(id: string): StoryUser | undefined {
    return this.users.find(u => u.id === id);
  }

  getZuckTimeline(): Array<{
    id: string;
    photo: string;
    name: string;
    link: string;
    lastUpdated: number;
    items: Array<{
      id: string;
      type: string;
      length: number;
      src: string;
      preview: string;
      link: string;
      linkText: string;
      time: number;
      seen: boolean;
    }>;
  }> {
    return this.users.map(user => ({
      id: user.id,
      photo: user.photo,
      name: user.name,
      link: '',
      lastUpdated: user.lastUpdated,
      items: user.items.map(item => ({
        id: item.id,
        type: item.type === 'text' ? 'photo' : (item.type === 'video' ? 'video' : 'photo'),
        length: item.duration,
        src: item.type === 'text' ? this.generateTextImage(item.text!, item.gradient!) : item.src!,
        preview: item.type === 'text' ? '' : (item.preview || ''),
        link: '',
        linkText: '',
        time: item.time,
        seen: item.seen
      }))
    }));
  }

  private generateTextImage(text: string, gradient: string): string {
    // For text stories, we'll use a data URI with an SVG
    // This gets rendered by zuck.js as an image
    const encodedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          ${this.gradientToSvgStops(gradient)}
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#bg)"/>
      <text x="540" y="960" text-anchor="middle" dominant-baseline="central"
        font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
        font-size="72" font-weight="700" fill="white"
        style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
        ${this.wrapSvgText(encodedText, 540, 960, 72)}
      </text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  private wrapSvgText(text: string, x: number, y: number, fontSize: number): string {
    const words = text.split(' ');
    const maxCharsPerLine = 15;
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    const lineHeight = fontSize * 1.3;
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    return lines.map((line, i) =>
      `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`
    ).join('');
  }

  private gradientToSvgStops(gradient: string): string {
    const colorMatch = gradient.match(/#[a-fA-F0-9]{6}/g);
    if (!colorMatch) return '<stop offset="0%" stop-color="#6a11cb"/><stop offset="100%" stop-color="#2575fc"/>';
    return colorMatch.map((color, i) =>
      `<stop offset="${(i / (colorMatch.length - 1)) * 100}%" stop-color="${color}"/>`
    ).join('');
  }

  addStoryItem(item: StoryItem): void {
    const ownUser = this.users.find(u => u.isOwn);
    if (ownUser) {
      ownUser.items.push(item);
      ownUser.lastUpdated = Date.now() / 1000;
    }
  }

  getFilterMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const user of this.users) {
      for (const item of user.items) {
        if (item.cssFilter && item.cssFilter !== 'none') {
          map[item.id] = item.cssFilter;
        }
      }
    }
    return map;
  }

  getStoryItemMeta(storyItemId: string): { type: string; text?: string; gradient?: string } | null {
    for (const user of this.users) {
      const item = user.items.find(i => i.id === storyItemId);
      if (item) {
        return { type: item.type, text: item.text, gradient: item.gradient };
      }
    }
    return null;
  }
}
