/**
 * RANDOMLY — useUserData hook
 *
 * Single source of truth for:
 *   - favouriteIds   (Set<string>)
 *   - completions    (CompletionRecord[])
 *   - persisted filters (FilterState)
 *   - Supabase authentication
 *   - Cloud-saved favorites (synced when authenticated)
 *
 * State is initialised from localStorage on mount and written back
 * whenever it changes.  Components receive stable callback refs so
 * they do not re-render unnecessarily.
 *
 * When user is authenticated:
 *   - Favorites are synced to Supabase (cloud)
 *   - Local favorites are merged with cloud on login
 *
 * When user is NOT authenticated:
 *   - Favorites use localStorage only (existing behavior)
 *
 * Completion behaviour:
 *   Each call to completeActivity() adds a new record with the current
 *   timestamp.  If the same activity is completed multiple times the
 *   history records all completions — users may genuinely repeat activities.
 *   The UI shows the count and most-recent date.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type { FilterState } from './filters';
import { EMPTY_FILTERS } from './filters';
import {
  readUserData,
  writeUserData,
  readPersistedFilters,
  writePersistedFilters,
  DEFAULT_FILTERS,
} from './storage';
import type { CompletionRecord, PersistedUserData } from './storage';
import { supabase } from './supabaseClient';

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

  /** Supabase authentication state */
  user: User | null;
  sessionLoading: boolean;
  /** Sign up with email and password */
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
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

// ── Supabase helpers ─────────────────────────────────────────

/** Fetch favorites from Supabase for a given user */
async function fetchCloudFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('activity_id')
    .eq('user_id', userId) as { data: { activity_id: string }[] | null; error: Error | null };

  if (error) {
    console.error('Error fetching cloud favorites:', error);
    return [];
  }

  if (!data) return [];
  return data.map((row) => row.activity_id);
}

/** Add a favorite to Supabase */
async function addCloudFavorite(userId: string, activityId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, activity_id: activityId }) as { error: Error | null };

  if (error) {
    console.error('Error adding cloud favorite:', error);
  }
}

/** Remove a favorite from Supabase */
async function removeCloudFavorite(userId: string, activityId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error removing cloud favorite:', error);
  }
}

/** Sync local favorites to cloud (merge, preferring cloud for duplicates) */
async function syncFavoritesToCloud(
  userId: string,
  localFavorites: string[]
): Promise<string[]> {
  // Fetch cloud favorites
  const cloudFavorites = await fetchCloudFavorites(userId);

  // Merge: local + cloud (deduplicated)
  const merged = [...new Set([...localFavorites, ...cloudFavorites])];

  // Push all to cloud (this ensures cloud is source of truth)
  if (merged.length > 0) {
    const inserts = merged.map((activityId) => ({
      user_id: userId,
      activity_id: activityId,
    })) as { user_id: string; activity_id: string }[];

    // Insert ignoring duplicates (RLS will handle permissions)
    const { error } = await supabase
      .from('favorites')
      .upsert(inserts, { onConflict: 'user_id,activity_id' }) as { error: Error | null };

    if (error) {
      console.error('Error syncing favorites to cloud:', error);
    }
  }

  return merged;
}

// ── Hook ──────────────────────────────────────────────────────

export function useUserData(): UserDataActions {
  // Lazy-initialise from localStorage
  const [userData, setUserData] = useState<PersistedUserData>(() => readUserData());
  const [filters, setFiltersState] = useState<FilterState>(() => {
    const persisted = readPersistedFilters();
    return hydrateFilters(persisted.filters);
  });

  // Supabase auth state
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const initialFetchDone = useRef(false);

  // ── Auth: Initialize session ────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setUser(session?.user ?? null);
      setSessionLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setSessionLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── Auth: Sync favorites when user logs in ─────────────────
  useEffect(() => {
    if (!user || initialFetchDone.current) return;
    initialFetchDone.current = true;

    const localFavorites = userData.favouriteIds;

    // If user has local favorites, merge with cloud
    if (localFavorites.length > 0) {
      syncFavoritesToCloud(user.id, localFavorites).then((merged) => {
        setUserData((prev) => ({ ...prev, favouriteIds: merged }));
      });
    } else {
      // Just fetch cloud favorites
      fetchCloudFavorites(user.id).then((cloudFavorites) => {
        if (cloudFavorites.length > 0) {
          setUserData((prev) => ({ ...prev, favouriteIds: cloudFavorites }));
        }
      });
    }
  }, [user]);

  // Derived set for O(1) lookup
  const favouriteSet = new Set(userData.favouriteIds);

  // Persist userData whenever it changes (for non-authenticated users)
  // When authenticated, we still persist locally as backup
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
      const isCurrentlyFavourite = ids.includes(id);
      const next = isCurrentlyFavourite
        ? ids.filter((x) => x !== id)
        : [...ids, id];

      // Sync to cloud if authenticated
      if (user) {
        if (isCurrentlyFavourite) {
          removeCloudFavorite(user.id, id);
        } else {
          addCloudFavorite(user.id, id);
        }
      }

      return { ...prev, favouriteIds: next };
    });
  }, [user]);

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

  // ── Auth methods ────────────────────────────────────────────

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error as Error | null };
    } catch (e) {
      return { error: e as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    } catch (e) {
      return { error: e as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Keep local favorites when signing out (user can log in again later)
    // Clear the flag so next login will re-fetch from cloud
    initialFetchDone.current = false;
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

    user,
    sessionLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}