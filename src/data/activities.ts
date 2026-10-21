/**
 * RANDOMLY — Activity Library Barrel
 *
 * Merges all category datasets, validates uniqueness at module load,
 * and re-exports everything from types.ts for backwards compatibility.
 */

// ── Re-export all types and label maps (preserves existing imports) ─────────
export type {
  Activity,
  Category,
  DifficultyLevel,
  Duration,
  Mood,
  Budget,
  Location,
  Company,
  DurationFilter,
} from './types';

export {
  CATEGORY_LABELS,
  MOOD_LABELS,
  MOOD_EMOJI,
  BUDGET_LABELS,
  BUDGET_EMOJI,
  LOCATION_LABELS,
  LOCATION_EMOJI,
  COMPANY_LABELS,
  COMPANY_EMOJI,
  DURATION_FILTER_LABELS,
  DURATION_FILTER_EMOJI,
  DURATION_FILTER_MAP,
} from './types';

// ── Category datasets ─────────────────────────────────────────────────────
import { creativeActivities }  from './creative';
import { outdoorActivities, additionalOutdoorActivities } from './outdoor';
import { wellnessActivities }  from './wellness';
import { socialActivities }    from './social';
import { learningActivities }  from './learning';
import { foodActivities }      from './food';
import { gamingActivities }    from './gaming';
import { extraActivities }     from './extra';

// ── Merge ─────────────────────────────────────────────────────────────────
const ALL_ACTIVITIES_RAW = [
  ...creativeActivities,
  ...outdoorActivities,
  ...additionalOutdoorActivities,
  ...wellnessActivities,
  ...socialActivities,
  ...learningActivities,
  ...foodActivities,
  ...gamingActivities,
  ...extraActivities,
];

// ── Uniqueness validation (runs once at module load in dev + prod) ─────────
(function validateIds() {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const a of ALL_ACTIVITIES_RAW) {
    if (seen.has(a.id)) dupes.push(a.id);
    seen.add(a.id);
  }
  if (dupes.length > 0) {
    throw new Error(
      `[Randomly] Duplicate activity IDs found: ${dupes.join(', ')}. ` +
        'All activity IDs must be unique.',
    );
  }
})();

/** The full curated activity library — immutable at runtime */
export const mockActivities = ALL_ACTIVITIES_RAW;

/** Activities flagged for the "Featured Picks" section */
export const featuredActivities = mockActivities.filter((a) => a.isFeatured);

/** Returns a random activity from the full list, ignoring any filters */
export function getRandomActivity() {
  return mockActivities[Math.floor(Math.random() * mockActivities.length)];
}

/**
 * Returns a random activity from a pre-filtered pool.
 * Falls back to the full library if the pool is empty.
 */
export function getRandomFromPool(pool: typeof mockActivities) {
  const source = pool.length > 0 ? pool : mockActivities;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * Deterministic version for testing — accepts a custom random function
 * so tests can control which activity is returned.
 */
export function getRandomFromPoolWith(
  pool: typeof mockActivities,
  random: () => number,
) {
  const source = pool.length > 0 ? pool : mockActivities;
  return source[Math.floor(random() * source.length)];
}
