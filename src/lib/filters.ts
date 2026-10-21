/**
 * RANDOMLY — Pure filter logic
 *
 * This module owns the FilterState type and the predicate that applies
 * filters to the activity list.  It has no React or DOM dependencies so it
 * can be unit-tested independently and re-used when a real recommendation
 * engine is added later.
 */

import type {
  Activity,
  Category,
  Mood,
  Budget,
  Location,
  Company,
  DurationFilter,
} from '../data/activities';
import { DURATION_FILTER_MAP } from '../data/activities';

// ── Filter state type ─────────────────────────────────────────

/**
 * Represents the current state of all filter dimensions.
 * `null` means "no filter applied for this dimension" (show all).
 * Arrays are used where a dimension allows multiple simultaneous selections,
 * but for now each dimension holds exactly one value or null (single-select).
 * Switching to multi-select later only requires changing the union type here.
 */
export interface FilterState {
  category:  Category  | null;
  mood:      Mood      | null;
  duration:  DurationFilter | null;
  budget:    Budget    | null;
  location:  Location  | null;
  company:   Company   | null;
}

/** The blank / reset state */
export const EMPTY_FILTERS: FilterState = {
  category: null,
  mood:     null,
  duration: null,
  budget:   null,
  location: null,
  company:  null,
};

/** Returns true when no filter dimension is set */
export function isFiltersEmpty(f: FilterState): boolean {
  return (
    f.category === null &&
    f.mood     === null &&
    f.duration === null &&
    f.budget   === null &&
    f.location === null &&
    f.company  === null
  );
}

/** Counts how many dimensions are currently active */
export function activeFilterCount(f: FilterState): number {
  return (Object.values(f) as (string | null)[]).filter(
    (v) => v !== null,
  ).length;
}

// ── Core filter predicate ─────────────────────────────────────

/**
 * Returns true when an activity satisfies all active filter dimensions.
 * Any dimension with a null value is skipped (no constraint).
 */
export function activityMatchesFilters(
  activity: Activity,
  filters: FilterState,
): boolean {
  // Category
  if (filters.category !== null && activity.category !== filters.category) {
    return false;
  }

  // Mood — activity must list this mood
  if (filters.mood !== null && !activity.moods.includes(filters.mood)) {
    return false;
  }

  // Duration — map the bucket to a set of Duration strings
  if (filters.duration !== null) {
    const allowed = DURATION_FILTER_MAP[filters.duration];
    if (!allowed.includes(activity.duration)) return false;
  }

  // Budget
  if (filters.budget !== null && activity.budget !== filters.budget) {
    return false;
  }

  // Location — "either" on the activity side passes any location filter
  if (filters.location !== null) {
    if (
      activity.location !== 'either' &&
      activity.location !== filters.location
    ) {
      return false;
    }
  }

  // Company — activity must support this company type
  if (filters.company !== null && !activity.company.includes(filters.company)) {
    return false;
  }

  return true;
}

/**
 * Applies FilterState to an array of activities and returns the matching
 * subset in the original order.
 */
export function applyFilters(
  activities: Activity[],
  filters: FilterState,
): Activity[] {
  if (isFiltersEmpty(filters)) return activities;
  return activities.filter((a) => activityMatchesFilters(a, filters));
}

// ── Toggle helpers ────────────────────────────────────────────
// Clicking an already-active filter value deselects it (toggle behaviour).

export function toggleFilter<K extends keyof FilterState>(
  current: FilterState,
  key: K,
  value: FilterState[K],
): FilterState {
  return {
    ...current,
    [key]: current[key] === value ? null : value,
  };
}
