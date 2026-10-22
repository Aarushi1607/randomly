import { useState, useCallback, useMemo } from 'react';
import styles from './ActivityGrid.module.css';
import { Button } from './Button';
import { Card } from './Card';
import { FilterPanel } from './FilterPanel';
import { ActivityDetail } from './ActivityDetail';
import {
  mockActivities,
  featuredActivities,
  getRandomFromPool,
} from '../data/activities';
import type { Activity } from '../data/activities';
import { applyFilters, isFiltersEmpty } from '../lib/filters';
import type { UserDataActions } from '../lib/useUserData';
import type { UserDataPanelTab } from './UserDataPanel';

interface ActivityGridProps {
  userData: UserDataActions;
  onOpenPanel: (tab: UserDataPanelTab) => void;
}

export function ActivityGrid({ userData, onOpenPanel }: ActivityGridProps) {
  // ── Surprise Me state ─────────────────────────────────────
  const [pickedActivity, setPickedActivity] = useState<Activity | null>(null);
  const [isSpinning,     setIsSpinning]     = useState(false);

  // ── Panel open/close (mobile filters) ─────────────────────
  const [panelOpen, setPanelOpen] = useState(false);

  // ── Detail modal ──────────────────────────────────────────
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);

  // ── Filters come from persisted userData hook ─────────────
  const { filters, setFilters, resetFilters } = userData;

  // ── Derived filtered list ─────────────────────────────────
  const filteredActivities = useMemo(
    () => applyFilters(mockActivities, filters),
    [filters],
  );

  // ── Handlers ─────────────────────────────────────────────

  const handleFilterChange = useCallback((next: typeof filters) => {
    setFilters(next);
    setPickedActivity((prev) => {
      if (!prev) return null;
      return applyFilters([prev], next).length > 0 ? prev : null;
    });
  }, [setFilters]);

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleSurpriseMe = useCallback(() => {
    setIsSpinning(true);
    setPickedActivity(null);
    setTimeout(() => {
      setPickedActivity(getRandomFromPool(filteredActivities));
      setIsSpinning(false);
    }, 700);
  }, [filteredActivities]);

  const handleDetails = useCallback((id: string) => {
    const found = mockActivities.find((a) => a.id === id) ?? null;
    setDetailActivity(found);
  }, []);

  const handleReroll = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => {
      const pool = filteredActivities.filter((a) => a.id !== pickedActivity?.id);
      setPickedActivity(getRandomFromPool(pool.length > 0 ? pool : filteredActivities));
      setIsSpinning(false);
    }, 500);
  }, [filteredActivities, pickedActivity]);

  const filtersActive = !isFiltersEmpty(filters);

  return (
    <section className={styles.section} id="discover" aria-labelledby="discover-heading">

      {/* Detail modal */}
      {detailActivity && (
        <ActivityDetail
          activity={detailActivity}
          onClose={() => setDetailActivity(null)}
          isFavourite={userData.isFavourite(detailActivity.id)}
          onToggleFavourite={userData.toggleFavourite}
          isCompleted={userData.isCompleted(detailActivity.id)}
          onComplete={(id) => {
            userData.completeActivity(id);
          }}
        />
      )}

      {/* ── Section header ─────────────────────────────── */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionEyebrow} aria-hidden="true">
          what should i do today?
        </div>
        <h2 id="discover-heading" className={styles.sectionTitle}>
          Discover Something New
        </h2>
        <p className={styles.sectionSubtitle}>
          Filter by mood, budget, time, or just hit the button.
        </p>
      </div>

      {/* ── Surprise Me zone ──────────────────────────── */}
      <div className={styles.surpriseZone} role="region" aria-label="Random activity picker">
        <div className={styles.surpriseBox}>
          

          <p className={styles.surpriseTagline}>
            {filtersActive
              ? `Picking from ${filteredActivities.length} matching activit${filteredActivities.length === 1 ? 'y' : 'ies'}…`
              : 'Feeling lucky? Let the universe decide.'}
          </p>

          <Button
            variant="surprise"
            size="lg"
            onClick={handleSurpriseMe}
            loading={isSpinning}
            disabled={filteredActivities.length === 0}
            aria-live="polite"
            aria-label={
              filteredActivities.length === 0
                ? 'No activities match the current filters'
                : 'Pick a random activity for me'
            }
          >
            {isSpinning ? 'Picking...' : 'Surprise Me!'}
          </Button>

          {!isSpinning && pickedActivity && (
            <div
              className={styles.pickedReveal}
              role="status"
              aria-live="polite"
              aria-label={`Random activity picked: ${pickedActivity.title}`}
            >
              <div className={styles.pickedLabel} aria-hidden="true">
                your activity awaits!
              </div>
              <Card
                activity={pickedActivity}
                highlighted
                onDetails={handleDetails}
                isFavourite={userData.isFavourite(pickedActivity.id)}
                onToggleFavourite={userData.toggleFavourite}
                isCompleted={userData.isCompleted(pickedActivity.id)}
              />
              <div className={styles.rerollRow}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReroll}
                  aria-label="Pick a different random activity"
                >
                  Pick another
                </Button>
              </div>
            </div>
          )}

          {!isSpinning && !pickedActivity && (
            <p className={styles.emptyHint} aria-hidden="true">
              press the button, i dare you
            </p>
          )}
        </div>
      </div>

      {/* ── Browse section ──────────────────────────────── */}
      <div className={styles.browseSection}>
        <div className={styles.browseHeader}>
          <h3 className={styles.browseTitle}>Or browse them all</h3>
          <button
            type="button"
            className={styles.filterToggleBtn}
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="filter-panel"
          >
            {panelOpen ? '✕ Hide filters' : '🎛️ Filters'}
            {filtersActive && (
              <span className={styles.filterToggleBadge} aria-hidden="true">●</span>
            )}
          </button>
        </div>

        <div className={[styles.browseLayout, panelOpen ? styles.panelVisible : ''].join(' ')}>
          <div
            id="filter-panel"
            className={[styles.filterSidebar, panelOpen ? styles.filterSidebarOpen : ''].join(' ')}
          >
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalCount={mockActivities.length}
              matchCount={filteredActivities.length}
            />
          </div>

          <div className={styles.resultsCol}>
            {filtersActive && (
              <div className={styles.filterSummary} role="status" aria-live="polite">
                <span className={styles.filterSummaryText}>
                  Showing <strong>{filteredActivities.length}</strong> of{' '}
                  {mockActivities.length} activities
                </span>
                <button
                  type="button"
                  className={styles.clearFiltersBtn}
                  onClick={handleReset}
                  aria-label="Clear all filters"
                >
                  ✕ Clear all
                </button>
              </div>
            )}

            {filteredActivities.length > 0 ? (
              <div
                className={styles.grid}
                role="list"
                aria-label={filtersActive ? `${filteredActivities.length} matching activities` : 'All activities'}
              >
                {filteredActivities.map((activity) => (
                  <div key={activity.id} role="listitem">
                    <Card
                      activity={activity}
                      highlighted={activity.isFeatured}
                      onDetails={handleDetails}
                      isFavourite={userData.isFavourite(activity.id)}
                      onToggleFavourite={userData.toggleFavourite}
                      isCompleted={userData.isCompleted(activity.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState} role="status" aria-live="polite">
                <span className={styles.emptyEmoji} aria-hidden="true">🫥</span>
                <p className={styles.emptyTitle}>No activities match your filters.</p>
                <p className={styles.emptySubtitle}>
                  Try relaxing a few filters, or clear them all to see everything.
                </p>
                <Button variant="primary" size="md" onClick={handleReset}>
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Featured picks ───────────────────────────────── */}
      <div className={styles.featuredSection}>
        <div className={styles.featuredLabel} aria-hidden="true">⭐ staff picks ⭐</div>
        <h3 className={styles.featuredTitle}>Today's Featured Picks</h3>
        <div className={styles.featuredGrid} role="list" aria-label="Featured activities">
          {featuredActivities.map((activity) => (
            <div key={activity.id} role="listitem">
              <Card
                activity={activity}
                highlighted
                onDetails={handleDetails}
                isFavourite={userData.isFavourite(activity.id)}
                onToggleFavourite={userData.toggleFavourite}
                isCompleted={userData.isCompleted(activity.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Shortcut to favourites/history ───────────────── */}
      {(userData.favouriteIds.length > 0 || userData.completions.length > 0) && (
        <div className={styles.userDataShortcut}>
          {userData.favouriteIds.length > 0 && (
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onOpenPanel('favourites')}
            >
              ❤️ View {userData.favouriteIds.length} saved
            </button>
          )}
          {userData.completions.length > 0 && (
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onOpenPanel('history')}
            >
              ✅ {userData.completions.length} completed
            </button>
          )}
        </div>
      )}
    </section>
  );
}
