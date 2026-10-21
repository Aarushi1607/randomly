/* ============================================================
   RANDOMLY — Mock Activity Data
   Temporary data for UI development. Replace with real API later.
   ============================================================ */

export type Category =
  | 'outdoor'
  | 'creative'
  | 'social'
  | 'learning'
  | 'wellness'
  | 'food'
  | 'gaming';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type Duration = '< 15 min' | '15–30 min' | '30–60 min' | '1–2 hrs' | '2+ hrs';

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
}

export const CATEGORY_LABELS: Record<Category, string> = {
  outdoor:  'Outdoor',
  creative: 'Creative',
  social:   'Social',
  learning: 'Learning',
  wellness: 'Wellness',
  food:     'Food & Drink',
  gaming:   'Gaming',
};

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
    tags: ['nature', 'relaxing', 'solo or group'],
  },
  {
    id: 'a2',
    title: 'Blind Contour Drawing',
    description:
      "Draw something without looking at your paper — only look at the subject. The wonkier the result, the better! It's a classic art warm-up with hilarious outcomes.",
    emoji: '✏️',
    category: 'creative',
    duration: '15–30 min',
    difficulty: 'easy',
    tags: ['art', 'drawing', 'no supplies needed'],
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
    tags: ['cooking', 'creative', 'solo'],
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
    tags: ['movement', 'mood boost', 'solo'],
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
  },
  {
    id: 'a9',
    title: 'Call an Old Friend',
    description:
      'Find someone you haven\'t spoken to in over a year. Call (not text). Catch up. No agenda, no time limit, just genuine reconnection.',
    emoji: '📞',
    category: 'social',
    duration: '30–60 min',
    difficulty: 'easy',
    tags: ['connection', 'conversation', 'heartwarming'],
  },
];

export const featuredActivities = mockActivities.filter((a) => a.isFeatured);

/** Returns a random activity from the full list */
export function getRandomActivity(): Activity {
  return mockActivities[Math.floor(Math.random() * mockActivities.length)];
}
