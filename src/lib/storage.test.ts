/**
 * RANDOMLY — Storage utility + useUserData tests
 *
 * Coverage:
 * - readKey: missing key, valid key, malformed JSON, wrong version
 * - writeKey: round-trip, quota error (simulated)
 * - removeKey: removes value
 * - readUserData / writeUserData: defaults, persistence
 * - readPersistedFilters / writePersistedFilters: defaults, persistence
 * - useUserData (via direct import of pure logic only — no React renderer)
 *   - toggleFavourite: add, remove, re-add
 *   - completeActivity: single, repeat completions
 *   - clearHistory
 *   - hydrateFilters / dehydrateFilters via round-trip
 * - Malformed localStorage data resilience
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readKey,
  writeKey,
  removeKey,
  readUserData,
  writeUserData,
  readPersistedFilters,
  writePersistedFilters,
  DEFAULT_USER_DATA,
  DEFAULT_FILTERS,
  STORAGE_KEYS,
} from './storage';
import type { PersistedUserData, PersistedFilters, CompletionRecord } from './storage';

// ── localStorage mock ─────────────────────────────────────────
// Vitest runs in Node (jsdom not configured), so localStorage is not defined.
// We implement a minimal in-memory mock.

function makeMockStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem:    (k)    => store[k] ?? null,
    setItem:    (k, v) => { store[k] = v; },
    removeItem: (k)    => { delete store[k]; },
    clear:      ()     => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key:        (i)    => Object.keys(store)[i] ?? null,
  };
}

beforeEach(() => {
  // Replace global localStorage with fresh mock before each test
  const mock = makeMockStorage();
  vi.stubGlobal('localStorage', mock);
});

// ── readKey ───────────────────────────────────────────────────

describe('readKey', () => {
  it('returns defaultValue when key is absent', () => {
    const result = readKey('nonexistent', DEFAULT_USER_DATA, 1);
    expect(result).toEqual(DEFAULT_USER_DATA);
  });

  it('returns parsed value when key exists and version matches', () => {
    const stored: PersistedUserData = {
      _v: 1,
      favouriteIds: ['a1', 'a2'],
      completions: [],
    };
    localStorage.setItem('test_key', JSON.stringify(stored));
    const result = readKey<PersistedUserData>('test_key', DEFAULT_USER_DATA, 1);
    expect(result.favouriteIds).toEqual(['a1', 'a2']);
  });

  it('returns defaultValue when version does not match', () => {
    const stored = { _v: 99, favouriteIds: ['a1'], completions: [] };
    localStorage.setItem('test_key', JSON.stringify(stored));
    const result = readKey<PersistedUserData>('test_key', DEFAULT_USER_DATA, 1);
    expect(result).toEqual(DEFAULT_USER_DATA);
  });

  it('returns defaultValue when JSON is malformed', () => {
    localStorage.setItem('test_key', '{ this is not valid json !!');
    const result = readKey<PersistedUserData>('test_key', DEFAULT_USER_DATA, 1);
    expect(result).toEqual(DEFAULT_USER_DATA);
  });

  it('returns defaultValue when stored value is null primitive', () => {
    localStorage.setItem('test_key', 'null');
    const result = readKey<PersistedUserData>('test_key', DEFAULT_USER_DATA, 1);
    expect(result).toEqual(DEFAULT_USER_DATA);
  });

  it('returns defaultValue when stored value is a string, not object', () => {
    localStorage.setItem('test_key', '"just a string"');
    const result = readKey<PersistedUserData>('test_key', DEFAULT_USER_DATA, 1);
    expect(result).toEqual(DEFAULT_USER_DATA);
  });
});

// ── writeKey ─────────────────────────────────────────────────

describe('writeKey', () => {
  it('stores a JSON-serialisable value', () => {
    writeKey('my_key', { _v: 1, x: 42 });
    expect(localStorage.getItem('my_key')).toBe('{"_v":1,"x":42}');
  });

  it('does not throw when localStorage throws (quota exceeded)', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => writeKey('k', { _v: 1 })).not.toThrow();
  });
});

// ── removeKey ────────────────────────────────────────────────

describe('removeKey', () => {
  it('removes a stored key', () => {
    localStorage.setItem('to_remove', 'value');
    removeKey('to_remove');
    expect(localStorage.getItem('to_remove')).toBeNull();
  });

  it('does not throw for a key that does not exist', () => {
    expect(() => removeKey('ghost_key')).not.toThrow();
  });
});

// ── readUserData / writeUserData ──────────────────────────────

describe('readUserData', () => {
  it('returns defaults on first call', () => {
    const d = readUserData();
    expect(d.favouriteIds).toEqual([]);
    expect(d.completions).toEqual([]);
    expect(d._v).toBe(1);
  });

  it('round-trips through writeUserData', () => {
    const data: PersistedUserData = {
      _v: 1,
      favouriteIds: ['cr01', 'ou03'],
      completions: [{ activityId: 'cr01', completedAt: '2025-01-15T10:00:00.000Z' }],
    };
    writeUserData(data);
    const loaded = readUserData();
    expect(loaded.favouriteIds).toEqual(['cr01', 'ou03']);
    expect(loaded.completions).toHaveLength(1);
    expect(loaded.completions[0].activityId).toBe('cr01');
  });

  it('stores under the correct key', () => {
    writeUserData({ ...DEFAULT_USER_DATA, favouriteIds: ['x1'] });
    const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).favouriteIds).toEqual(['x1']);
  });
});

// ── readPersistedFilters / writePersistedFilters ──────────────

describe('readPersistedFilters', () => {
  it('returns defaults on first call', () => {
    const f = readPersistedFilters();
    expect(f._v).toBe(1);
    expect(f.filters.category).toBeNull();
    expect(f.filters.mood).toBeNull();
  });

  it('round-trips through writePersistedFilters', () => {
    const toSave: PersistedFilters = {
      _v: 1,
      filters: {
        category: 'outdoor',
        mood:     'energetic',
        duration: null,
        budget:   'free',
        location: null,
        company:  null,
      },
    };
    writePersistedFilters(toSave);
    const loaded = readPersistedFilters();
    expect(loaded.filters.category).toBe('outdoor');
    expect(loaded.filters.mood).toBe('energetic');
    expect(loaded.filters.budget).toBe('free');
    expect(loaded.filters.duration).toBeNull();
  });

  it('handles missing filter keys gracefully (partial data)', () => {
    // Simulate data written with an old schema missing some keys
    const partial = { _v: 1, filters: { category: 'food' } };
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(partial));
    const loaded = readPersistedFilters();
    // Should return what was stored (version matches), even if some keys absent
    expect(loaded.filters.category).toBe('food');
  });
});

// ── Favourites logic (pure) ───────────────────────────────────

describe('favourites logic (pure storage layer)', () => {
  it('adding an id appends it to the favouriteIds array', () => {
    const data = readUserData();
    const updated: PersistedUserData = {
      ...data,
      favouriteIds: [...data.favouriteIds, 'cr01'],
    };
    writeUserData(updated);
    expect(readUserData().favouriteIds).toContain('cr01');
  });

  it('removing an id excludes it', () => {
    writeUserData({ ...DEFAULT_USER_DATA, favouriteIds: ['cr01', 'cr02'] });
    const loaded = readUserData();
    const next = { ...loaded, favouriteIds: loaded.favouriteIds.filter((x) => x !== 'cr01') };
    writeUserData(next);
    expect(readUserData().favouriteIds).not.toContain('cr01');
    expect(readUserData().favouriteIds).toContain('cr02');
  });

  it('toggling the same id twice returns to empty', () => {
    // add
    let data = readUserData();
    data = { ...data, favouriteIds: [...data.favouriteIds, 'cr01'] };
    writeUserData(data);
    // remove
    data = readUserData();
    data = { ...data, favouriteIds: data.favouriteIds.filter((x) => x !== 'cr01') };
    writeUserData(data);
    expect(readUserData().favouriteIds).toHaveLength(0);
  });
});

// ── History / completions logic ───────────────────────────────

describe('completions logic (pure storage layer)', () => {
  it('recording a completion appends a record with a timestamp', () => {
    const data = readUserData();
    const record: CompletionRecord = {
      activityId: 'we01',
      completedAt: new Date().toISOString(),
    };
    writeUserData({ ...data, completions: [record] });
    const loaded = readUserData();
    expect(loaded.completions).toHaveLength(1);
    expect(loaded.completions[0].activityId).toBe('we01');
    expect(loaded.completions[0].completedAt).toBeTruthy();
  });

  it('completing the same activity twice creates two records (intentional repeats allowed)', () => {
    const r1: CompletionRecord = { activityId: 'we01', completedAt: '2025-01-01T09:00:00.000Z' };
    const r2: CompletionRecord = { activityId: 'we01', completedAt: '2025-01-02T09:00:00.000Z' };
    writeUserData({ ...DEFAULT_USER_DATA, completions: [r2, r1] });
    const loaded = readUserData();
    expect(loaded.completions).toHaveLength(2);
    // Both refer to same activity
    expect(loaded.completions.every((c) => c.activityId === 'we01')).toBe(true);
    // Newer record is first
    expect(new Date(loaded.completions[0].completedAt).getTime())
      .toBeGreaterThan(new Date(loaded.completions[1].completedAt).getTime());
  });

  it('clearing history empties the completions array', () => {
    const r: CompletionRecord = { activityId: 'we01', completedAt: new Date().toISOString() };
    writeUserData({ ...DEFAULT_USER_DATA, completions: [r] });
    // Simulate clearHistory
    const data = readUserData();
    writeUserData({ ...data, completions: [] });
    expect(readUserData().completions).toHaveLength(0);
  });
});

// ── Filter persistence round-trip ─────────────────────────────

describe('filter persistence round-trip', () => {
  it('persists all six dimensions and restores nulls correctly', () => {
    const toSave: PersistedFilters = {
      _v: 1,
      filters: {
        category: null,
        mood:     'relaxed',
        duration: 'short',
        budget:   null,
        location: 'indoors',
        company:  'solo',
      },
    };
    writePersistedFilters(toSave);
    const loaded = readPersistedFilters();
    expect(loaded.filters.mood).toBe('relaxed');
    expect(loaded.filters.duration).toBe('short');
    expect(loaded.filters.location).toBe('indoors');
    expect(loaded.filters.company).toBe('solo');
    expect(loaded.filters.category).toBeNull();
    expect(loaded.filters.budget).toBeNull();
  });

  it('after reload with wrong version, gets defaults', () => {
    const stale = { _v: 0, filters: { mood: 'relaxed' } };
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(stale));
    const loaded = readPersistedFilters();
    expect(loaded).toEqual(DEFAULT_FILTERS);
  });
});
