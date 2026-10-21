/**
 * RANDOMLY — useUserData hook
 *
 * Single source of truth for:
 *   - favouriteIds   (Set<string>)
 *   - completions    (CompletionRecord[])
 *   - persisted filters (FilterState)
 *
 * State is initialised from localStorage on mount and written back
 * whenever it changes.  Components receive stable callback refs so
 * they do not re-render unnecessarily.
 *
 * Completion behaviour:
 *   Each call to completeActivity() adds a new record with the current
 *   timestamp.  If the same activity is completed multiple times the
 *   history records all completions — users may genuinely repeat activities.
 *   The UI shows the count and most-recent date.
 */

import { useState, useCallback, useEffect } from 'react';
import type { FilterState } from './filters';
import { EMPTY_FILTERS } from './filters';
import {
  readUserData,
  writeUserData,
  readPersistedFilters,
  writePersistedFilters,
  DEFAULT_FILTERS,
} from './storage';
import type { CompletionRecord } from './storage';

// ── Types ─────────────────────────────────────────────────────

export interface UserDataActions {
  /** True when the given activity id is in favourites */
  isFavourite: (id: string) => boolean;
  /** Toggle favourite state for an activity */
  toggleFavourite: (id: string) => void;
  /** Sorted list of favourite ids (insertion order) */
  favouriteIds: readonly string[];

  /** All completion records, newest first */
  completions: readonly CompletionRecord[];
  /** True if the activity has been completed at least once */
  isCompleted: (id: string) => boolean;
  /** Record a completion of the given activity */
  completeActivity: (id: string) => void;
  /** Remove all completion records — caller should confirm first */
  clearHistory: () => void;

  /** Currently active (possibly persisted) filters */
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  resetFilters: () => void;
}

// ── Helpers ───────────────────────────────────────────────────

/** Convert stored filter record to a proper FilterState */
function hydrateFilters(raw: Record<string, string | null>): FilterState {
  // Only pick known keys; unknown keys are ignored
  return {
    category: (raw['category'] as FilterState['category']) ?? null,
    mood:     (raw['mood']     as FilterState['mood'])     ?? null,
    duration: (raw['duration'] as FilterState['duration']) ?? null,
    budget:   (raw['budget']   as FilterState['budget'])   ?? null,
    location: (raw['location'] as FilterState['location']) ?? null,
    company:  (raw['company']  as FilterState['company'])  ?? null,
  };
}

/** Convert a FilterState to a plain record for storage */
function dehydrateFilters(f: FilterState): Record<string, string | null> {
  return {
    category: f.category,
    mood:     f.mood,
    duration: f.duration,
    budget:   f.budget,
    location: f.location,
    company:  f.company,
  };
}

// ── Hook ──────────────────────────────────────────────────────

export function useUserData(): UserDataActions {
  // Lazy-initialise from localStorage
  const [userData, setUserData] = useState(() => readUserData());
  const [filters,  setFiltersState] = useState<FilterState>(() => {
    const persisted = readPersistedFilters();
    return hydrateFilters(persisted.filters);
  });

  // Derived set for O(1) lookup
  const favouriteSet = new Set(userData.favouriteIds);

  // Persist userData whenever it changes
  useEffect(() => {
    writeUserData(userData);
  }, [userData]);

  // Persist filters whenever they change
  useEffect(() => {
    writePersistedFilters({
      _v: DEFAULT_FILTERS._v,
      filters: dehydrateFilters(filters),
    });
  }, [filters]);

  // ── Favourites ──────────────────────────────────────────────

  const isFavourite = useCallback(
    (id: string) => favouriteSet.has(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userData.favouriteIds],
  );

  const toggleFavourite = useCallback((id: string) => {
    setUserData((prev) => {
      const ids = prev.favouriteIds;
      const next = ids.includes(id)
        ? ids.filter((x) => x !== id)
        : [...ids, id];
      return { ...prev, favouriteIds: next };
    });
  }, []);

  // ── History ─────────────────────────────────────────────────

  const isCompleted = useCallback(
    (id: string) => userData.completions.some((c) => c.activityId === id),
    [userData.completions],
  );

  const completeActivity = useCallback((id: string) => {
    const record: CompletionRecord = {
      activityId:  id,
      completedAt: new Date().toISOString(),
    };
    setUserData((prev) => ({
      ...prev,
      // Prepend so newest appears first
      completions: [record, ...prev.completions],
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setUserData((prev) => ({ ...prev, completions: [] }));
  }, []);

  // ── Filters ─────────────────────────────────────────────────

  const setFilters = useCallback((next: FilterState) => {
    setFiltersState(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(EMPTY_FILTERS);
  }, []);

  return {
    isFavourite,
    toggleFavourite,
    favouriteIds: userData.favouriteIds,

    completions: userData.completions,
    isCompleted,
    completeActivity,
    clearHistory,

    filters,
    setFilters,
    resetFilters,
  };
}
