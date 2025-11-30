
export type Category = string;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  time?: string; // e.g., "14:00"
  date?: string; // YYYY-MM-DD
  duration?: number; // in minutes
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  lastModified: Date;
  date?: string; // YYYY-MM-DD
}

export interface VisualTheme {
  id: string;
  label: string;
  accentColor: string;
  secondaryAccentColor: string;
  textColor: string;
  subTextColor: string;
  glassColor: string;
  borderColor: string;
  isDark: boolean;
  blurStrength: string; // e.g., 'backdrop-blur-xl'
}

export interface Wallpaper {
  id: string;
  url: string;
  label: string;
}

// Deprecated in favor of VisualTheme + Wallpaper combination, 
// but kept compatible for component props if needed, though we will refactor to use VisualTheme mostly.
export interface ThemeConfig extends VisualTheme {
  name: string; // Compatibility
  backgroundUrl: string; // Compatibility
}

export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // "06:00"
  endTime: string;   // "07:30"
  type: 'sleep' | 'workout' | 'work' | 'personal' | 'generic';
  meta?: {
    score?: number;
    calories?: number;
    duration?: string;
  };
}

export interface UserProfile {
  name: string;
  location: string;
  hasOnboarded: boolean;
}

export type AppMode = 'tasks' | 'notes' | 'calendar';
