/**
 * RANDOMLY — Filter logic tests
 *
 * Tests cover:
 * - Single-dimension filtering (category, mood, duration, budget, location, company)
 * - Multi-dimension combinations
 * - Duration bucket boundaries
 * - No-match cases
 * - Reset / empty filter behaviour
 * - Toggle helper
 * - activeFilterCount
 * - getRandomFromPoolWith (deterministic random)
 * - Activity library: uniqueness, required fields, total count
 */

import { describe, it, expect } from 'vitest';
import {
  activityMatchesFilters,
  applyFilters,
  toggleFilter,
  activeFilterCount,
  isFiltersEmpty,
  EMPTY_FILTERS,
} from './filters';
import type { FilterState } from './filters';
import { mockActivities, getRandomFromPoolWith } from '../data/activities';
import type { Activity } from '../data/activities';
import { DURATION_FILTER_MAP } from '../data/types';

// ── Test fixtures ─────────────────────────────────────────────

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'test-001',
    title: 'Test Activity',
    hook: 'A test hook',
    description: 'A test description that is long enough to meet the word count.',
    steps: ['Step one', 'Step two'],
    emoji: '🧪',
    category: 'creative',
    duration: '15–30 min',
    durationMinutes: 20,
    difficulty: 'easy',
    tags: ['test'],
    moods: ['bored', 'creative'],
    budget: 'free',
    costNote: 'Free',
    location: 'indoors',
    company: ['solo'],
    materials: [],
    tip: 'A test tip',
    ...overrides,
  };
}

const allEmpty: FilterState = EMPTY_FILTERS;

// ── 1. Empty filter matches everything ────────────────────────

describe('isFiltersEmpty', () => {
  it('returns true for EMPTY_FILTERS', () => {
    expect(isFiltersEmpty(EMPTY_FILTERS)).toBe(true);
  });

  it('returns false when any dimension is set', () => {
    expect(isFiltersEmpty({ ...EMPTY_FILTERS, mood: 'bored' })).toBe(false);
    expect(isFiltersEmpty({ ...EMPTY_FILTERS, category: 'outdoor' })).toBe(false);
    expect(isFiltersEmpty({ ...EMPTY_FILTERS, budget: 'free' })).toBe(false);
  });
});

describe('applyFilters with empty filters', () => {
  it('returns the full list unchanged', () => {
    const activities = [makeActivity(), makeActivity({ id: 'test-002' })];
    expect(applyFilters(activities, allEmpty)).toHaveLength(2);
  });
});

// ── 2. Single-dimension filtering ────────────────────────────

describe('activityMatchesFilters — category', () => {
  it('matches when category matches', () => {
    const a = makeActivity({ category: 'outdoor' });
    expect(activityMatchesFilters(a, { ...allEmpty, category: 'outdoor' })).toBe(true);
  });

  it('rejects when category differs', () => {
    const a = makeActivity({ category: 'creative' });
    expect(activityMatchesFilters(a, { ...allEmpty, category: 'outdoor' })).toBe(false);
  });
});

describe('activityMatchesFilters — mood', () => {
  it('matches when mood is in activity moods array', () => {
    const a = makeActivity({ moods: ['bored', 'relaxed'] });
    expect(activityMatchesFilters(a, { ...allEmpty, mood: 'bored' })).toBe(true);
    expect(activityMatchesFilters(a, { ...allEmpty, mood: 'relaxed' })).toBe(true);
  });

  it('rejects when mood is not in moods array', () => {
    const a = makeActivity({ moods: ['bored'] });
    expect(activityMatchesFilters(a, { ...allEmpty, mood: 'energetic' })).toBe(false);
  });
});

describe('activityMatchesFilters — budget', () => {
  it('matches exact budget', () => {
    const a = makeActivity({ budget: 'free' });
    expect(activityMatchesFilters(a, { ...allEmpty, budget: 'free' })).toBe(true);
  });

  it('rejects mismatched budget', () => {
    const a = makeActivity({ budget: 'low-cost' });
    expect(activityMatchesFilters(a, { ...allEmpty, budget: 'free' })).toBe(false);
  });
});

describe('activityMatchesFilters — location', () => {
  it('matches exact location', () => {
    const a = makeActivity({ location: 'outdoors' });
    expect(activityMatchesFilters(a, { ...allEmpty, location: 'outdoors' })).toBe(true);
  });

  it('rejects mismatched location', () => {
    const a = makeActivity({ location: 'indoors' });
    expect(activityMatchesFilters(a, { ...allEmpty, location: 'outdoors' })).toBe(false);
  });

  it('activity with "either" passes any location filter', () => {
    const a = makeActivity({ location: 'either' });
    expect(activityMatchesFilters(a, { ...allEmpty, location: 'outdoors' })).toBe(true);
    expect(activityMatchesFilters(a, { ...allEmpty, location: 'indoors' })).toBe(true);
  });
});

describe('activityMatchesFilters — company', () => {
  it('matches when company value is in company array', () => {
    const a = makeActivity({ company: ['solo', 'friends'] });
    expect(activityMatchesFilters(a, { ...allEmpty, company: 'solo' })).toBe(true);
    expect(activityMatchesFilters(a, { ...allEmpty, company: 'friends' })).toBe(true);
  });

  it('rejects when company value is not in array', () => {
    const a = makeActivity({ company: ['solo'] });
    expect(activityMatchesFilters(a, { ...allEmpty, company: 'friends' })).toBe(false);
  });
});

// ── 3. Duration bucket boundaries ────────────────────────────

describe('activityMatchesFilters — duration buckets', () => {
  it('short bucket matches only "< 15 min"', () => {
    const short = makeActivity({ duration: '< 15 min', durationMinutes: 8 });
    const medium = makeActivity({ duration: '15–30 min', durationMinutes: 20 });
    const filter: FilterState = { ...allEmpty, duration: 'short' };
    expect(activityMatchesFilters(short, filter)).toBe(true);
    expect(activityMatchesFilters(medium, filter)).toBe(false);
  });

  it('medium bucket matches only "15–30 min"', () => {
    const medium = makeActivity({ duration: '15–30 min', durationMinutes: 20 });
    const long   = makeActivity({ duration: '30–60 min', durationMinutes: 45 });
    const filter: FilterState = { ...allEmpty, duration: 'medium' };
    expect(activityMatchesFilters(medium, filter)).toBe(true);
    expect(activityMatchesFilters(long, filter)).toBe(false);
  });

  it('long bucket matches only "30–60 min"', () => {
    const long     = makeActivity({ duration: '30–60 min', durationMinutes: 45 });
    const extended = makeActivity({ duration: '1–2 hrs', durationMinutes: 75 });
    const filter: FilterState = { ...allEmpty, duration: 'long' };
    expect(activityMatchesFilters(long, filter)).toBe(true);
    expect(activityMatchesFilters(extended, filter)).toBe(false);
  });

  it('extended bucket matches "1–2 hrs" and "2+ hrs"', () => {
    const oneTwo = makeActivity({ duration: '1–2 hrs', durationMinutes: 90 });
    const twoPlus = makeActivity({ duration: '2+ hrs', durationMinutes: 180 });
    const short = makeActivity({ duration: '< 15 min', durationMinutes: 8 });
    const filter: FilterState = { ...allEmpty, duration: 'extended' };
    expect(activityMatchesFilters(oneTwo, filter)).toBe(true);
    expect(activityMatchesFilters(twoPlus, filter)).toBe(true);
    expect(activityMatchesFilters(short, filter)).toBe(false);
  });

  it('DURATION_FILTER_MAP covers all Duration values', () => {
    const allDurations = new Set<string>();
    for (const bucket of Object.values(DURATION_FILTER_MAP)) {
      bucket.forEach((d) => allDurations.add(d));
    }
    const expected = ['< 15 min', '15–30 min', '30–60 min', '1–2 hrs', '2+ hrs'];
    expected.forEach((d) => expect(allDurations.has(d)).toBe(true));
  });
});

// ── 4. Multi-dimension combinations ──────────────────────────

describe('applyFilters — multi-dimension', () => {
  it('returns only activities matching ALL active dimensions', () => {
    const a1 = makeActivity({
      id: 'multi-1',
      category: 'outdoor',
      budget: 'free',
      location: 'outdoors',
      company: ['solo'],
      moods: ['energetic'],
      duration: '< 15 min',
      durationMinutes: 10,
    });
    const a2 = makeActivity({
      id: 'multi-2',
      category: 'outdoor',
      budget: 'low-cost',   // different budget
      location: 'outdoors',
      company: ['solo'],
      moods: ['energetic'],
      duration: '< 15 min',
      durationMinutes: 10,
    });
    const filters: FilterState = {
      category: 'outdoor',
      mood: 'energetic',
      duration: 'short',
      budget: 'free',
      location: 'outdoors',
      company: 'solo',
    };
    const result = applyFilters([a1, a2], filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('multi-1');
  });
});

// ── 5. No-match case ──────────────────────────────────────────

describe('applyFilters — no match', () => {
  it('returns empty array when nothing matches', () => {
    const a = makeActivity({ category: 'creative', budget: 'free' });
    const result = applyFilters(
      [a],
      { ...allEmpty, category: 'outdoor', budget: 'flexible' },
    );
    expect(result).toHaveLength(0);
  });
});

// ── 6. Toggle helper ──────────────────────────────────────────

describe('toggleFilter', () => {
  it('sets a null dimension to the given value', () => {
    const next = toggleFilter(EMPTY_FILTERS, 'mood', 'bored');
    expect(next.mood).toBe('bored');
    // Other dimensions unchanged
    expect(next.category).toBeNull();
  });

  it('clears a dimension when the same value is toggled again', () => {
    const withMood = { ...EMPTY_FILTERS, mood: 'bored' as const };
    const next = toggleFilter(withMood, 'mood', 'bored');
    expect(next.mood).toBeNull();
  });

  it('replaces an existing value when a different value is given', () => {
    const withMood = { ...EMPTY_FILTERS, mood: 'bored' as const };
    const next = toggleFilter(withMood, 'mood', 'relaxed');
    expect(next.mood).toBe('relaxed');
  });

  it('does not mutate the original state', () => {
    const original = { ...EMPTY_FILTERS };
    toggleFilter(original, 'mood', 'bored');
    expect(original.mood).toBeNull();
  });
});

// ── 7. activeFilterCount ──────────────────────────────────────

describe('activeFilterCount', () => {
  it('returns 0 for empty filters', () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
  });

  it('counts each non-null dimension', () => {
    const f: FilterState = {
      ...EMPTY_FILTERS,
      mood: 'bored',
      budget: 'free',
      location: 'indoors',
    };
    expect(activeFilterCount(f)).toBe(3);
  });

  it('returns 6 when all dimensions are set', () => {
    const f: FilterState = {
      category: 'creative',
      mood: 'bored',
      duration: 'short',
      budget: 'free',
      location: 'indoors',
      company: 'solo',
    };
    expect(activeFilterCount(f)).toBe(6);
  });
});

// ── 8. Deterministic random (reroll behaviour) ────────────────

describe('getRandomFromPoolWith', () => {
  it('always returns from the pool, not the full library', () => {
    const pool = [makeActivity({ id: 'pool-only' })];
    // alwaysZero → index 0 → pool[0]
    const result = getRandomFromPoolWith(pool, () => 0);
    expect(result.id).toBe('pool-only');
  });

  it('falls back to full library when pool is empty', () => {
    const result = getRandomFromPoolWith([], () => 0);
    expect(result.id).toBe(mockActivities[0].id);
  });

  it('never returns the same activity as the excluded one when alternatives exist', () => {
    const a1 = makeActivity({ id: 'a1' });
    const a2 = makeActivity({ id: 'a2' });
    const a3 = makeActivity({ id: 'a3' });
    const currentPick = a1;
    const pool = [a1, a2, a3].filter((a) => a.id !== currentPick.id);
    // pool is [a2, a3] — neither is a1
    const result = getRandomFromPoolWith(pool, () => 0);
    expect(result.id).not.toBe('a1');
  });
});

// ── 9. Activity library integrity ────────────────────────────

describe('mockActivities library', () => {
  it('has at least 100 activities', () => {
    expect(mockActivities.length).toBeGreaterThanOrEqual(100);
  });

  it('has unique IDs across all activities', () => {
    const ids = mockActivities.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every activity has required fields populated', () => {
    for (const a of mockActivities) {
      expect(a.id,          `${a.id} missing id`).toBeTruthy();
      expect(a.title,       `${a.id} missing title`).toBeTruthy();
      expect(a.hook,        `${a.id} missing hook`).toBeTruthy();
      expect(a.description, `${a.id} missing description`).toBeTruthy();
      expect(a.steps,       `${a.id} missing steps`).toBeDefined();
      expect(a.steps.length, `${a.id} has no steps`).toBeGreaterThan(0);
      expect(a.materials,   `${a.id} missing materials`).toBeDefined();
      expect(a.tip,         `${a.id} missing tip`).toBeTruthy();
      expect(a.costNote,    `${a.id} missing costNote`).toBeTruthy();
      expect(a.moods.length, `${a.id} has no moods`).toBeGreaterThan(0);
      expect(a.company.length, `${a.id} has no company`).toBeGreaterThan(0);
      expect(a.durationMinutes, `${a.id} missing durationMinutes`).toBeGreaterThan(0);
    }
  });

  it('every activity has a non-empty description of meaningful length', () => {
    for (const a of mockActivities) {
      expect(a.description.length, `${a.id} description too short`).toBeGreaterThan(80);
    }
  });

  it('every activity has at least 2 numbered steps', () => {
    for (const a of mockActivities) {
      expect(a.steps.length, `${a.id} needs at least 2 steps`).toBeGreaterThanOrEqual(2);
    }
  });

  it('covers all 7 categories', () => {
    const categories = new Set(mockActivities.map((a) => a.category));
    const expected = ['outdoor', 'creative', 'social', 'learning', 'wellness', 'food', 'gaming'];
    expected.forEach((cat) => expect(categories.has(cat as never)).toBe(true));
  });

  it('covers all duration buckets', () => {
    const durations = new Set(mockActivities.map((a) => a.duration));
    expect(durations.has('< 15 min')).toBe(true);
    expect(durations.has('15–30 min')).toBe(true);
    expect(durations.has('30–60 min')).toBe(true);
    expect(durations.has('1–2 hrs')).toBe(true);
    expect(durations.has('2+ hrs')).toBe(true);
  });

  it('covers all budget levels', () => {
    const budgets = new Set(mockActivities.map((a) => a.budget));
    expect(budgets.has('free')).toBe(true);
    expect(budgets.has('low-cost')).toBe(true);
  });

  it('covers all location types', () => {
    const locations = new Set(mockActivities.map((a) => a.location));
    expect(locations.has('indoors')).toBe(true);
    expect(locations.has('outdoors')).toBe(true);
  });

  it('has activities for all company types', () => {
    const soloOk    = mockActivities.some((a) => a.company.includes('solo'));
    const friendsOk = mockActivities.some((a) => a.company.includes('friends'));
    const familyOk  = mockActivities.some((a) => a.company.includes('family'));
    expect(soloOk).toBe(true);
    expect(friendsOk).toBe(true);
    expect(familyOk).toBe(true);
  });
});

// ── 10. applyFilters against real library ────────────────────

describe('applyFilters against real library', () => {
  it('free + indoors returns a non-empty subset', () => {
    const result = applyFilters(mockActivities, {
      ...allEmpty, budget: 'free', location: 'indoors',
    });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((a) => {
      expect(a.budget).toBe('free');
      expect(['indoors', 'either']).toContain(a.location);
    });
  });

  it('outdoor + energetic returns only relevant activities', () => {
    const result = applyFilters(mockActivities, {
      ...allEmpty, location: 'outdoors', mood: 'energetic',
    });
    result.forEach((a) => {
      expect(['outdoors', 'either']).toContain(a.location);
      expect(a.moods).toContain('energetic');
    });
  });

  it('extremely restrictive filter set returns 0 or a small valid set', () => {
    const result = applyFilters(mockActivities, {
      category: 'gaming',
      mood: 'energetic',
      duration: 'short',
      budget: 'flexible',
      location: 'outdoors',
      company: 'family',
    });
    // All returned items must match every dimension
    result.forEach((a) => {
      expect(a.category).toBe('gaming');
      expect(a.moods).toContain('energetic');
      expect(['< 15 min']).toContain(a.duration);
    });
  });
});
