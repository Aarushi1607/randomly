/* ============================================================
   RANDOMLY — Shared activity types & label maps
   Kept in a separate file so data modules and the filter
   library can both import without circular dependencies.
   ============================================================ */

// ── Core dimension types ──────────────────────────────────────

export type Category =
  | 'outdoor'
  | 'creative'
  | 'social'
  | 'learning'
  | 'wellness'
  | 'food'
  | 'gaming';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Display-ready duration bucket */
export type Duration = '< 15 min' | '15–30 min' | '30–60 min' | '1–2 hrs' | '2+ hrs';

export type Mood = 'bored' | 'energetic' | 'relaxed' | 'creative' | 'social';
export type Budget = 'free' | 'low-cost' | 'flexible';
export type Location = 'indoors' | 'outdoors' | 'either';
export type Company = 'solo' | 'friends' | 'family';
export type DurationFilter = 'short' | 'medium' | 'long' | 'extended';

// ── Main interface ────────────────────────────────────────────

export interface Activity {
  /** Stable unique identifier — must never be reused */
  id: string;
  /** Short, memorable title */
  title: string;
  /** One-sentence hook shown in the card preview */
  hook: string;
  /** 50–100 word description explaining what it is and why it's good */
  description: string;
  /** 2–5 numbered steps to get started immediately */
  steps: string[];
  /** Emoji representing the activity */
  emoji: string;
  category: Category;
  /** Display-ready duration bucket */
  duration: Duration;
  /** Approximate duration in minutes (midpoint of bucket, for sorting/filtering) */
  durationMinutes: number;
  difficulty: DifficultyLevel;
  isFeatured?: boolean;
  /** Short searchable tags */
  tags: string[];
  moods: Mood[];
  budget: Budget;
  /** Approximate cost description, e.g. "Free", "~£5", "Varies" */
  costNote: string;
  location: Location;
  company: Company[];
  /** What you need — empty array means nothing required */
  materials: string[];
  /** A bonus tip, variation, or optional challenge */
  tip: string;
  /** Only include when genuinely relevant — keep it brief */
  safetyNote?: string;
}

// ── Label maps ────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<Category, string> = {
  outdoor:  'Outdoor',
  creative: 'Creative',
  social:   'Social',
  learning: 'Learning',
  wellness: 'Wellness',
  food:     'Food & Drink',
  gaming:   'Gaming',
};

export const MOOD_LABELS: Record<Mood, string> = {
  bored:     'Bored',
  energetic: 'Energetic',
  relaxed:   'Relaxed',
  creative:  'Creative',
  social:    'Social',
};

export const MOOD_EMOJI: Record<Mood, string> = {
  bored:     '😑',
  energetic: '⚡',
  relaxed:   '😌',
  creative:  '🎨',
  social:    '🫂',
};

export const BUDGET_LABELS: Record<Budget, string> = {
  free:       'Free',
  'low-cost': 'Low-cost',
  flexible:   'Flexible',
};

export const BUDGET_EMOJI: Record<Budget, string> = {
  free:       '🆓',
  'low-cost': '💸',
  flexible:   '💳',
};

export const LOCATION_LABELS: Record<Location, string> = {
  indoors:  'Indoors',
  outdoors: 'Outdoors',
  either:   'Either',
};

export const LOCATION_EMOJI: Record<Location, string> = {
  indoors:  '🏠',
  outdoors: '🌳',
  either:   '🌍',
};

export const COMPANY_LABELS: Record<Company, string> = {
  solo:    'Solo',
  friends: 'With Friends',
  family:  'With Family',
};

export const COMPANY_EMOJI: Record<Company, string> = {
  solo:    '🧍',
  friends: '👯',
  family:  '👨‍👩‍👧',
};

export const DURATION_FILTER_LABELS: Record<DurationFilter, string> = {
  short:    '< 15 min',
  medium:   '15–30 min',
  long:     '30–60 min',
  extended: '1+ hour',
};

export const DURATION_FILTER_EMOJI: Record<DurationFilter, string> = {
  short:    '⚡',
  medium:   '☕',
  long:     '🕐',
  extended: '📅',
};

export const DURATION_FILTER_MAP: Record<DurationFilter, Duration[]> = {
  short:    ['< 15 min'],
  medium:   ['15–30 min'],
  long:     ['30–60 min'],
  extended: ['1–2 hrs', '2+ hrs'],
};
