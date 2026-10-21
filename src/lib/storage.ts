/**
 * RANDOMLY — localStorage utility
 *
 * Provides typed, versioned, safe read/write helpers for localStorage.
 * Never throws — any parse error or schema mismatch returns the default.
 *
 * Versioning strategy:
 *   Each stored key has a `_v` field.  When the schema changes, bump
 *   SCHEMA_VERSION for that key and add a migration case in readKey().
 *   Old data is discarded (returns defaultValue) when versions don't match.
 */

// ── Types ─────────────────────────────────────────────────────

/** A single completion record */
export interface CompletionRecord {
  /** activity id */
  activityId: string;
  /** ISO-8601 timestamp */
  completedAt: string;
}

/** The full shape stored under KEYS.USER_DATA */
export interface PersistedUserData {
  _v: number;
  favouriteIds: string[];
  completions: CompletionRecord[];
}

/** The filter preferences stored under KEYS.FILTERS */
export interface PersistedFilters {
  _v: number;
  /** Serialised FilterState — values may be null */
  filters: Record<string, string | null>;
}

// ── Storage keys ──────────────────────────────────────────────

export const STORAGE_KEYS = {
  USER_DATA: 'randomly__user_data',
  FILTERS:   'randomly__filters',
} as const;

// ── Schema versions — bump when shape changes ─────────────────

const SCHEMA_VERSION = {
  USER_DATA: 1,
  FILTERS:   1,
} as const;

// ── Defaults ─────────────────────────────────────────────────

export const DEFAULT_USER_DATA: PersistedUserData = {
  _v: SCHEMA_VERSION.USER_DATA,
  favouriteIds: [],
  completions:  [],
};

export const DEFAULT_FILTERS: PersistedFilters = {
  _v: SCHEMA_VERSION.FILTERS,
  filters: {
    category: null,
    mood:     null,
    duration: null,
    budget:   null,
    location: null,
    company:  null,
  },
};

// ── Core helpers ──────────────────────────────────────────────

/**
 * Safely read and parse a JSON value from localStorage.
 * Returns `defaultValue` for any error or version mismatch.
 */
export function readKey<T extends { _v: number }>(
  key: string,
  defaultValue: T,
  expectedVersion: number,
): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as Record<string, unknown>)['_v'] !== expectedVersion
    ) {
      // Version mismatch or malformed — discard and use defaults
      return defaultValue;
    }
    return parsed as T;
  } catch {
    return defaultValue;
  }
}

/** Safely write a value to localStorage. Silently ignores quota errors. */
export function writeKey<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

/** Remove a key from localStorage. */
export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ── Domain-specific readers/writers ──────────────────────────

export function readUserData(): PersistedUserData {
  return readKey(
    STORAGE_KEYS.USER_DATA,
    DEFAULT_USER_DATA,
    SCHEMA_VERSION.USER_DATA,
  );
}

export function writeUserData(data: PersistedUserData): void {
  writeKey(STORAGE_KEYS.USER_DATA, data);
}

export function readPersistedFilters(): PersistedFilters {
  return readKey(
    STORAGE_KEYS.FILTERS,
    DEFAULT_FILTERS,
    SCHEMA_VERSION.FILTERS,
  );
}

export function writePersistedFilters(data: PersistedFilters): void {
  writeKey(STORAGE_KEYS.FILTERS, data);
}
