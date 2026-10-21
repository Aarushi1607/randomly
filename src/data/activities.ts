/* ============================================================
   RANDOMLY — Activity Data
   Single source of truth for all activity types and data.
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

/** Duration buckets — kept as display-ready strings for the UI */
export type Duration = '< 15 min' | '15–30 min' | '30–60 min' | '1–2 hrs' | '2+ hrs';

/** How the user is feeling right now */
export type Mood = 'bored' | 'energetic' | 'relaxed' | 'creative' | 'social';

/** Rough cost level */
export type Budget = 'free' | 'low-cost' | 'flexible';

/** Where you can do it */
export type Location = 'indoors' | 'outdoors' | 'either';

/** Who you want to do it with */
export type Company = 'solo' | 'friends' | 'family';

// ── Main interface ────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: Category;
  duration: Duration;
  difficulty: DifficultyLevel;
  isFeatured?: boolean;
  tags: string[];
  // New filterable dimensions
  moods: Mood[];
  budget: Budget;
  location: Location;
  company: Company[];
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
  bored:    'Bored',
  energetic:'Energetic',
  relaxed:  'Relaxed',
  creative: 'Creative',
  social:   'Social',
};

export const MOOD_EMOJI: Record<Mood, string> = {
  bored:    '😑',
  energetic:'⚡',
  relaxed:  '😌',
  creative: '🎨',
  social:   '🫂',
};

export const BUDGET_LABELS: Record<Budget, string> = {
  free:      'Free',
  'low-cost':'Low-cost',
  flexible:  'Flexible',
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

// ── Duration filter buckets ───────────────────────────────────
// Used by the filter UI — maps a display label to a set of Duration values

export type DurationFilter = 'short' | 'medium' | 'long' | 'extended';

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

/** Maps a DurationFilter key to the Duration values it covers */
export const DURATION_FILTER_MAP: Record<DurationFilter, Duration[]> = {
  short:    ['< 15 min'],
  medium:   ['15–30 min'],
  long:     ['30–60 min'],
  extended: ['1–2 hrs', '2+ hrs'],
};

// ── Activity data ─────────────────────────────────────────────

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: 'Cloud Shape Spotting',
    description:
      'Lie on the grass, gaze upward, and find animals, faces, and fantastical creatures hiding in the clouds. Bonus points for the most ridiculous interpretation.',
    emoji: '☁️',
    category: 'outdoor',
    duration: '15–30 min',
    difficulty: 'easy',
    isFeatured: true,
    tags: ['nature', 'relaxing', 'chill'],
    moods: ['bored', 'relaxed'],
    budget: 'free',
    location: 'outdoors',
    company: ['solo', 'friends', 'family'],
  },
  {
    id: 'a2',
    title: 'Blind Contour Drawing',
    description:
      "Draw something without looking at your paper — only at the subject. The wonkier the result, the better! A classic art warm-up with hilarious outcomes.",
    emoji: '✏️',
    category: 'creative',
    duration: '15–30 min',
    difficulty: 'easy',
    tags: ['art', 'drawing', 'no supplies needed'],
    moods: ['bored', 'creative'],
    budget: 'free',
    location: 'indoors',
    company: ['solo', 'friends'],
  },
  {
    id: 'a3',
    title: 'Midnight Snack Inventing',
    description:
      "Open your fridge and pantry. You have 20 minutes to invent the most outrageous (but edible) snack combo. Rate it, name it, never make it again.",
    emoji: '🧪',
    category: 'food',
    duration: '15–30 min',
    difficulty: 'medium',
    isFeatured: true,
    tags: ['cooking', 'creative', 'challenge'],
    moods: ['bored', 'creative'],
    budget: 'free',
    location: 'indoors',
    company: ['solo', 'friends'],
  },
  {
    id: 'a4',
    title: 'Learn 5 Words in a New Language',
    description:
      'Pick any language and learn exactly five words using a free dictionary or YouTube video. Use them in a sentence at the end. Proudly tell someone.',
    emoji: '🗣️',
    category: 'learning',
    duration: '15–30 min',
    difficulty: 'easy',
    tags: ['language', 'quick win', 'brain boost'],
    moods: ['bored', 'relaxed', 'creative'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a5',
    title: '10-Minute Dance Party',
    description:
      'Queue up your most embarrassing playlist, close the blinds (optional), and dance like absolutely nobody is watching. Minimum three songs required.',
    emoji: '🕺',
    category: 'wellness',
    duration: '< 15 min',
    difficulty: 'easy',
    isFeatured: true,
    tags: ['movement', 'mood boost', 'silly'],
    moods: ['bored', 'energetic'],
    budget: 'free',
    location: 'indoors',
    company: ['solo', 'friends'],
  },
  {
    id: 'a6',
    title: 'Write a One-Sentence Story',
    description:
      'Craft a complete story — beginning, middle, and end — in exactly one sentence. It must make sense. It must be surprising. Share it with the world.',
    emoji: '📝',
    category: 'creative',
    duration: '< 15 min',
    difficulty: 'medium',
    tags: ['writing', 'challenge', 'no supplies'],
    moods: ['bored', 'creative', 'relaxed'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a7',
    title: 'Stranger Things Bingo',
    description:
      'Rewatch any episode and make a bingo card of recurring tropes. Flashlights flickering, someone running, ominous synth music — mark them off as they appear.',
    emoji: '📺',
    category: 'gaming',
    duration: '1–2 hrs',
    difficulty: 'easy',
    tags: ['TV', 'game', 'group fun'],
    moods: ['bored', 'social', 'relaxed'],
    budget: 'free',
    location: 'indoors',
    company: ['solo', 'friends', 'family'],
  },
  {
    id: 'a8',
    title: 'Urban Scavenger Hunt',
    description:
      'Step outside and find: a red door, a cat, a funny sign, a landmark older than 50 years, and a stranger with cool shoes. Photograph each one.',
    emoji: '🗺️',
    category: 'outdoor',
    duration: '1–2 hrs',
    difficulty: 'medium',
    tags: ['exploration', 'photography', 'city'],
    moods: ['bored', 'energetic', 'social'],
    budget: 'free',
    location: 'outdoors',
    company: ['solo', 'friends'],
  },
  {
    id: 'a9',
    title: 'Call an Old Friend',
    description:
      "Find someone you haven't spoken to in over a year. Call (not text). Catch up. No agenda, no time limit, just genuine reconnection.",
    emoji: '📞',
    category: 'social',
    duration: '30–60 min',
    difficulty: 'easy',
    tags: ['connection', 'conversation', 'heartwarming'],
    moods: ['bored', 'relaxed', 'social'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a10',
    title: 'Neighbourhood Sunrise Walk',
    description:
      'Set an alarm, roll out of bed before the world wakes up, and walk somewhere you normally drive. Everything looks different at 6am.',
    emoji: '🌅',
    category: 'outdoor',
    duration: '30–60 min',
    difficulty: 'easy',
    tags: ['morning', 'peaceful', 'healthy'],
    moods: ['energetic', 'relaxed'],
    budget: 'free',
    location: 'outdoors',
    company: ['solo', 'friends'],
  },
  {
    id: 'a11',
    title: 'Make a Playlist for a Fictional Character',
    description:
      "Pick any character — a movie villain, a book hero, your childhood self — and curate the 10-song playlist they'd listen to obsessively. Export and share it.",
    emoji: '🎵',
    category: 'creative',
    duration: '30–60 min',
    difficulty: 'easy',
    tags: ['music', 'storytelling', 'low effort'],
    moods: ['creative', 'relaxed', 'bored'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a12',
    title: 'Board Game Night',
    description:
      'Dust off that game box gathering dust on the shelf. Set a time limit, make a snack, and actually finish the game for once.',
    emoji: '🎲',
    category: 'gaming',
    duration: '2+ hrs',
    difficulty: 'easy',
    isFeatured: false,
    tags: ['games', 'group', 'low-tech'],
    moods: ['social', 'bored'],
    budget: 'free',
    location: 'indoors',
    company: ['friends', 'family'],
  },
  {
    id: 'a13',
    title: 'Cook a Recipe from Another Country',
    description:
      "Pick a country at random, find one of its traditional dishes on YouTube, and actually cook it. Even if it goes wrong, you'll learn something and probably eat it anyway.",
    emoji: '🍜',
    category: 'food',
    duration: '1–2 hrs',
    difficulty: 'medium',
    tags: ['cooking', 'culture', 'adventure'],
    moods: ['creative', 'social', 'bored'],
    budget: 'low-cost',
    location: 'indoors',
    company: ['solo', 'friends', 'family'],
  },
  {
    id: 'a14',
    title: 'Yoga for Absolute Beginners',
    description:
      "A 20-minute beginner flow from YouTube, a clear floor, and whatever counts as 'comfortable clothes.' No mat required. You'll feel annoyingly good afterward.",
    emoji: '🧘',
    category: 'wellness',
    duration: '15–30 min',
    difficulty: 'easy',
    tags: ['movement', 'calm', 'body'],
    moods: ['relaxed', 'energetic'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a15',
    title: 'Plan a Dream Trip (No Budget Limit)',
    description:
      "Pick a destination you've always wanted to visit. Build the full itinerary — flights, hotels, restaurants, weird local things — as if money is no object. Save it for later.",
    emoji: '✈️',
    category: 'learning',
    duration: '1–2 hrs',
    difficulty: 'easy',
    tags: ['travel', 'dreaming', 'planning'],
    moods: ['bored', 'creative', 'relaxed'],
    budget: 'free',
    location: 'indoors',
    company: ['solo'],
  },
  {
    id: 'a16',
    title: 'Host an Impromptu Dinner',
    description:
      "Text three people right now: 'dinner at mine, 7pm, I\'m cooking.' Don't overthink the menu. The chaos is part of the fun.",
    emoji: '🍽️',
    category: 'social',
    duration: '2+ hrs',
    difficulty: 'medium',
    tags: ['hosting', 'cooking', 'spontaneous'],
    moods: ['social', 'energetic'],
    budget: 'low-cost',
    location: 'indoors',
    company: ['friends', 'family'],
  },
  {
    id: 'a17',
    title: 'Street Photography Walk',
    description:
      "Take your phone or camera out for 45 minutes and photograph only things at ground level — shoes, puddles, shadows, litter art. It changes how you see everything.",
    emoji: '📷',
    category: 'creative',
    duration: '30–60 min',
    difficulty: 'easy',
    tags: ['photography', 'walking', 'observation'],
    moods: ['creative', 'energetic', 'relaxed'],
    budget: 'free',
    location: 'outdoors',
    company: ['solo'],
  },
  {
    id: 'a18',
    title: 'Watch a Documentary About Something You Know Nothing About',
    description:
      "Open Netflix/YouTube. Search for a topic you'd never normally click on — deep-sea fish, medieval siege tactics, competitive flower arranging. Just watch one.",
    emoji: '🎬',
    category: 'learning',
    duration: '1–2 hrs',
    difficulty: 'easy',
    tags: ['documentary', 'learning', 'couch-friendly'],
    moods: ['bored', 'relaxed'],
    budget: 'free',
    location: 'indoors',
    company: ['solo', 'friends', 'family'],
  },
];

// ── Derived exports ───────────────────────────────────────────

export const featuredActivities = mockActivities.filter((a) => a.isFeatured);

/** Returns a random activity from the full list, ignoring filters */
export function getRandomActivity(): Activity {
  return mockActivities[Math.floor(Math.random() * mockActivities.length)];
}

/**
 * Returns a random activity from a pre-filtered list.
 * Falls back to the full list when the filtered pool is empty.
 */
export function getRandomFromPool(pool: Activity[]): Activity {
  const source = pool.length > 0 ? pool : mockActivities;
  return source[Math.floor(Math.random() * source.length)];
}
