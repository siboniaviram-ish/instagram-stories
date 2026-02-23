export interface FilterPreset {
  name: string;
  cssFilter: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  { name: 'Original', cssFilter: 'none' },
  { name: 'Paris', cssFilter: 'contrast(1.2) saturate(1.35)' },
  { name: 'Tokyo', cssFilter: 'brightness(1.05) hue-rotate(-10deg)' },
  { name: 'London', cssFilter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Rome', cssFilter: 'contrast(0.9) brightness(1.15) saturate(0.85)' },
  { name: 'Cairo', cssFilter: 'brightness(1.1) contrast(0.85) saturate(0.75) sepia(0.22)' },
  { name: 'Berlin', cssFilter: 'contrast(1.15) saturate(1.8) brightness(1.05) sepia(0.1)' },
  { name: 'Lisbon', cssFilter: 'saturate(0.66) brightness(1.05) contrast(0.88) sepia(0.15)' },
  { name: 'Vienna', cssFilter: 'saturate(0.85) contrast(0.95) brightness(1.08) sepia(0.12)' },
  { name: 'Seoul', cssFilter: 'contrast(1.05) saturate(0.9) brightness(1.05) sepia(0.08)' },
  { name: 'Athens', cssFilter: 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)' },
  { name: 'Havana', cssFilter: 'brightness(1.05) saturate(1.1) contrast(1.05) hue-rotate(5deg)' }
];
