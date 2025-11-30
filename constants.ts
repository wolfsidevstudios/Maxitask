
import { VisualTheme, Wallpaper, Task, TimelineEvent, Note } from './types';

export const WALLPAPERS: Wallpaper[] = [
  { id: 'w1', label: 'Mystic Mountain', url: 'https://i.ibb.co/F4JfK86G/Google-AI-Studio-2025-11-19-T01-12-08-540-Z.png' },
  { id: 'w2', label: 'Ethereal Blue', url: 'https://i.ibb.co/pv202ZHn/Image-fx-29.jpg' },
  { id: 'w3', label: 'Cosmic Dust', url: 'https://i.ibb.co/CKcbfpfQ/Image-fx-36.jpg' },
  { id: 'w4', label: 'Golden Hour', url: 'https://i.ibb.co/8gm9hv61/Image-fx-35.jpg' },
  { id: 'w5', label: 'Neon Tokyo', url: 'https://i.ibb.co/ynqnzLSX/Image-fx-34.jpg' },
  { id: 'w6', label: 'Cyber Zen', url: 'https://i.ibb.co/jvx7p1FT/Image-fx-33.jpg' },
  { id: 'w7', label: 'Deep Ocean', url: 'https://i.ibb.co/HMg2jqg/Image-fx-32.jpg' },
  { id: 'w8', label: 'Cotton Candy', url: 'https://i.ibb.co/LhPwWttz/Image-fx-31.jpg' },
  { id: 'w9', label: 'Aurora', url: 'https://i.ibb.co/GvNPkKKw/Image-fx-30.jpg' },
  { id: 'w10', label: 'Abstract Flow', url: 'https://i.ibb.co/9Hc7F4rd/Image-fx-37.jpg' },
  { id: 'w11', label: 'Crystal Horizon', url: 'https://i.ibb.co/S79N2L5y/upscalemedia-transformed-1.png' },
  { id: 'w12', label: 'Velvet Clouds', url: 'https://i.ibb.co/F4vzqfQ6/upscalemedia-transformed.jpg' },
];

export const VISUAL_THEMES: VisualTheme[] = [
  {
    id: 'classic',
    label: 'Classic Dark',
    accentColor: 'bg-purple-500',
    secondaryAccentColor: 'bg-purple-500/20',
    textColor: 'text-white',
    subTextColor: 'text-white/60',
    glassColor: 'bg-black/40',
    borderColor: 'border-white/10',
    isDark: true,
    blurStrength: 'backdrop-blur-xl',
  },
  {
    id: 'white',
    label: 'Clean White',
    accentColor: 'bg-slate-900',
    secondaryAccentColor: 'bg-slate-200',
    textColor: 'text-slate-900',
    subTextColor: 'text-slate-500',
    glassColor: 'bg-white/80',
    borderColor: 'border-white/60',
    isDark: false,
    blurStrength: 'backdrop-blur-lg',
  },
  {
    id: 'pink',
    label: 'Soft Pink',
    accentColor: 'bg-pink-400',
    secondaryAccentColor: 'bg-pink-100',
    textColor: 'text-slate-900',
    subTextColor: 'text-slate-600',
    glassColor: 'bg-pink-50/60',
    borderColor: 'border-pink-200/50',
    isDark: false,
    blurStrength: 'backdrop-blur-xl',
  },
  {
    id: 'light',
    label: 'Airy Light',
    accentColor: 'bg-blue-500',
    secondaryAccentColor: 'bg-blue-100',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-500',
    glassColor: 'bg-white/40',
    borderColor: 'border-white/40',
    isDark: false,
    blurStrength: 'backdrop-blur-md',
  },
  {
    id: 'liquid',
    label: 'Ultra Liquid',
    accentColor: 'bg-white',
    secondaryAccentColor: 'bg-white/20',
    textColor: 'text-white',
    subTextColor: 'text-white/70',
    glassColor: 'bg-white/5', // Extremely transparent
    borderColor: 'border-white/20',
    isDark: true,
    blurStrength: 'backdrop-blur-3xl',
  },
  {
    id: 'ghost',
    label: 'Ghost',
    accentColor: 'bg-zinc-200',
    secondaryAccentColor: 'bg-zinc-200/10',
    textColor: 'text-white',
    subTextColor: 'text-white/70', // Increased brightness for better legibility
    glassColor: 'bg-black/10', // Dark enough for contrast, transparent enough for background
    borderColor: 'border-white/5',
    isDark: true,
    blurStrength: 'backdrop-blur-sm', // Low blur to see the wallpaper details clearly
  },
];

export const INITIAL_CATEGORIES: string[] = ['Personal', 'Work', 'Hobbies', 'Other'];
export const INITIAL_TASKS: Task[] = [];
export const TIMELINE_EVENTS: TimelineEvent[] = [];
export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Project Ideas',
    content: '1. AI Task Manager\n2. Glassmorphism UI Kit\n3. React Native Port',
    category: 'Work',
    lastModified: new Date()
  },
  {
    id: 'n2',
    title: 'Grocery List',
    content: '- Milk\n- Eggs\n- Bread\n- Avocados',
    category: 'Personal',
    lastModified: new Date()
  }
];
