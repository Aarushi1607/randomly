import styles from './FilterPanel.module.css';
import { Badge } from './Badge';
import type { FilterState } from '../lib/filters';
import { toggleFilter, activeFilterCount, EMPTY_FILTERS } from '../lib/filters';
import {
  CATEGORY_LABELS,
  MOOD_LABELS, MOOD_EMOJI,
  BUDGET_LABELS, BUDGET_EMOJI,
  LOCATION_LABELS, LOCATION_EMOJI,
  COMPANY_LABELS, COMPANY_EMOJI,
  DURATION_FILTER_LABELS, DURATION_FILTER_EMOJI,
} from '../data/activities';
import type { Category, Mood, Budget, Location, Company, DurationFilter } from '../data/activities';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  totalCount: number;
  matchCount: number;
}

const ALL_CATEGORIES  = Object.keys(CATEGORY_LABELS)        as Category[];
const ALL_MOODS       = Object.keys(MOOD_LABELS)             as Mood[];
const ALL_DURATIONS   = Object.keys(DURATION_FILTER_LABELS)  as DurationFilter[];
const ALL_BUDGETS     = Object.keys(BUDGET_LABELS)           as Budget[];
const ALL_LOCATIONS   = Object.keys(LOCATION_LABELS)         as Location[];
const ALL_COMPANIES   = Object.keys(COMPANY_LABELS)          as Company[];

// ── Small internal chip component ─────────────────────────────

interface ChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
  'aria-label'?: string;
}

function Chip({ label, emoji, active, onClick, 'aria-label': ariaLabel }: ChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, active ? styles.chipActive : ''].join(' ')}
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel ?? label}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </button>
  );
}

// ── Filter group ───────────────────────────────────────────────

interface GroupProps {
  label: string;
  annotation?: string;
  children: React.ReactNode;
}

function FilterGroup({ label, annotation, children }: GroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHeader}>
        <span className={styles.groupLabel}>{label}</span>
        {annotation && (
          <span className={styles.groupAnnotation} aria-hidden="true">
            {annotation}
          </span>
        )}
      </div>
      <div className={styles.chipRow} role="group" aria-label={`Filter by ${label}`}>
        {children}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────

export function FilterPanel({
  filters,
  onChange,
  onReset,
  totalCount,
  matchCount,
}: FilterPanelProps) {
  const activeCount = activeFilterCount(filters);

  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange(toggleFilter(filters, key, value));
  }

  return (
    <aside
      className={styles.panel}
      aria-label="Activity filters"
    >
      {/* ── Panel header ──────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title} aria-hidden="true">🎛️ Filters</span>
          {activeCount > 0 && (
            <span className={styles.activeBadge} aria-label={`${activeCount} active filter${activeCount > 1 ? 's' : ''}`}>
              {activeCount}
            </span>
          )}
        </div>

        <div className={styles.headerRight}>
          <span className={styles.matchCount} aria-live="polite" aria-atomic="true">
            {matchCount === totalCount
              ? `${totalCount} activities`
              : `${matchCount} of ${totalCount}`}
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={onReset}
              aria-label="Clear all filters"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Filter groups ─────────────────────────────── */}
      <div className={styles.groups}>

        {/* Mood */}
        <FilterGroup label="How are you feeling?" annotation="pick a vibe ✦">
          {ALL_MOODS.map((mood) => (
            <Chip
              key={mood}
              label={MOOD_LABELS[mood]}
              emoji={MOOD_EMOJI[mood]}
              active={filters.mood === mood}
              onClick={() => toggle('mood', mood)}
            />
          ))}
        </FilterGroup>

        {/* Duration */}
        <FilterGroup label="How long do you have?" annotation="time check →">
          {ALL_DURATIONS.map((dur) => (
            <Chip
              key={dur}
              label={DURATION_FILTER_LABELS[dur]}
              emoji={DURATION_FILTER_EMOJI[dur]}
              active={filters.duration === dur}
              onClick={() => toggle('duration', dur)}
            />
          ))}
        </FilterGroup>

        {/* Category */}
        <FilterGroup label="Category" annotation="what kind of thing?">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={[styles.chip, filters.category === cat ? styles.chipActive : ''].join(' ')}
              onClick={() => toggle('category', cat)}
              aria-pressed={filters.category === cat}
              aria-label={`Category: ${CATEGORY_LABELS[cat]}`}
            >
              {/* reuse Badge for consistent look */}
              <Badge category={cat} size="sm" />
            </button>
          ))}
        </FilterGroup>

        {/* Budget */}
        <FilterGroup label="Budget" annotation="💰">
          {ALL_BUDGETS.map((b) => (
            <Chip
              key={b}
              label={BUDGET_LABELS[b]}
              emoji={BUDGET_EMOJI[b]}
              active={filters.budget === b}
              onClick={() => toggle('budget', b)}
            />
          ))}
        </FilterGroup>

        {/* Location */}
        <FilterGroup label="Where?" annotation="place matters →">
          {ALL_LOCATIONS.map((loc) => (
            <Chip
              key={loc}
              label={LOCATION_LABELS[loc]}
              emoji={LOCATION_EMOJI[loc]}
              active={filters.location === loc}
              onClick={() => toggle('location', loc)}
            />
          ))}
        </FilterGroup>

        {/* Company */}
        <FilterGroup label="Who's joining?" annotation="solo or squad →">
          {ALL_COMPANIES.map((co) => (
            <Chip
              key={co}
              label={COMPANY_LABELS[co]}
              emoji={COMPANY_EMOJI[co]}
              active={filters.company === co}
              onClick={() => toggle('company', co)}
            />
          ))}
        </FilterGroup>
      </div>

      {/* ── Empty state inside panel ───────────────────── */}
      {matchCount === 0 && (
        <div className={styles.panelEmpty} role="status">
          <span aria-hidden="true">🙈</span>
          <p>Nothing matches yet — try fewer filters.</p>
          <button
            type="button"
            className={styles.resetBtnLarge}
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      )}
    </aside>
  );
}

// Re-export so ActivityGrid can import EMPTY_FILTERS from one place
export { EMPTY_FILTERS };
