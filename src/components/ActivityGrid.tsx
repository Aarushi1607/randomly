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
import { EMPTY_FILTERS } from '../lib/filters';
import type { FilterState } from '../lib/filters';

export function ActivityGrid() {
  // ── Surprise Me state ─────────────────────────────────────
  const [pickedActivity, setPickedActivity]   = useState<Activity | null>(null);
  const [isSpinning,     setIsSpinning]        = useState(false);
  const [triedId,        setTriedId]           = useState<string | null>(null);

  // ── Filter state ──────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  // ── Panel open/close (mobile) ─────────────────────────────
  const [panelOpen, setPanelOpen] = useState(false);

  // ── Detail modal ──────────────────────────────────────────
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);

  // ── Derived filtered list ─────────────────────────────────
  const filteredActivities = useMemo(
    () => applyFilters(mockActivities, filters),
    [filters],
  );

  // ── Handlers ─────────────────────────────────────────────

  const handleFilterChange = useCallback((next: FilterState) => {
    setFilters(next);
    // If a picked activity no longer matches the new filters, clear it
    setPickedActivity((prev) => {
      if (!prev) return null;
      return applyFilters([prev], next).length > 0 ? prev : null;
    });
  }, []);

  const handleReset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    setIsSpinning(true);
    setPickedActivity(null);
    setTriedId(null);

    setTimeout(() => {
      // Respect active filters; fall back to full list if nothing matches
      setPickedActivity(getRandomFromPool(filteredActivities));
      setIsSpinning(false);
    }, 700);
  }, [filteredActivities]);

  const handleTryThis = useCallback((id: string) => {
    setTriedId(id);
  }, []);

  const handleDetails = useCallback((id: string) => {
    const found = mockActivities.find((a) => a.id === id) ?? null;
    setDetailActivity(found);
  }, []);

  // ── Reroll: pick another random from the filtered pool ────
  const handleReroll = useCallback(() => {
    setIsSpinning(true);
    setTriedId(null);

    setTimeout(() => {
      // exclude the current pick so we always get a different one
      const pool = filteredActivities.filter(
        (a) => a.id !== pickedActivity?.id,
      );
      setPickedActivity(getRandomFromPool(pool.length > 0 ? pool : filteredActivities));
      setIsSpinning(false);
    }, 500);
  }, [filteredActivities, pickedActivity]);

  const filtersActive = !isFiltersEmpty(filters);

  return (
    <section
      className={styles.section}
      id="discover"
      aria-labelledby="discover-heading"
    >
      {/* Detail modal — rendered at section root so it's above everything */}
      {detailActivity && (
        <ActivityDetail
          activity={detailActivity}
          onClose={() => setDetailActivity(null)}
          onTryThis={handleTryThis}
        />
      )}
      {/* ── Section header ─────────────────────────────── */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionEyebrow} aria-hidden="true">
          🗺️ what should i do today?
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
          <span className={styles.doodleStar}  aria-hidden="true">⭐</span>
          <span className={styles.doodleSparkle}  aria-hidden="true">✨</span>
          <span className={styles.doodleSparkle2} aria-hidden="true">🌟</span>

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
            {isSpinning ? 'Picking...' : '🎲 Surprise Me!'}
          </Button>

          {/* Picked activity reveal */}
          {!isSpinning && pickedActivity && (
            <div
              className={styles.pickedReveal}
              role="status"
              aria-live="polite"
              aria-label={`Random activity picked: ${pickedActivity.title}`}
            >
              <div className={styles.pickedLabel} aria-hidden="true">
                🎉 your activity awaits!
              </div>

              <Card
                activity={pickedActivity}
                highlighted
                onTryThis={handleTryThis}
                onDetails={handleDetails}
              />

              {/* Reroll button */}
              <div className={styles.rerollRow}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReroll}
                  aria-label="Pick a different random activity"
                >
                  🔀 Pick another
                </Button>
              </div>

              {triedId === pickedActivity.id && (
                <p className={styles.triedMessage} role="status">
                  ✅ Awesome! Go enjoy your adventure. You can always pick again!
                </p>
              )}
            </div>
          )}

          {!isSpinning && !pickedActivity && (
            <p className={styles.emptyHint} aria-hidden="true">
              👆 press the button, i dare you
            </p>
          )}
        </div>
      </div>

      {/* ── Browse section: filters + grid ──────────────── */}
      <div className={styles.browseSection}>

        {/* Browse heading row */}
        <div className={styles.browseHeader}>
          <h3 className={styles.browseTitle}>Or browse them all</h3>

          {/* Mobile filter toggle */}
          <button
            type="button"
            className={styles.filterToggleBtn}
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="filter-panel"
          >
            {panelOpen ? '✕ Hide filters' : '🎛️ Filters'}
            {filtersActive && (
              <span className={styles.filterToggleBadge} aria-hidden="true">
                ●
              </span>
            )}
          </button>
        </div>

        {/* Two-column layout: filter sidebar + results */}
        <div className={[styles.browseLayout, panelOpen ? styles.panelVisible : ''].join(' ')}>

          {/* Filter panel — sticky sidebar on desktop, toggled on mobile */}
          <div
            id="filter-panel"
            className={[styles.filterSidebar, panelOpen ? styles.filterSidebarOpen : ''].join(' ')}
            aria-hidden={!panelOpen && typeof window !== 'undefined' && window.innerWidth < 960}
          >
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalCount={mockActivities.length}
              matchCount={filteredActivities.length}
            />
          </div>

          {/* Results column */}
          <div className={styles.resultsCol}>

            {/* Active filter summary strip */}
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

            {/* Grid or empty state */}
            {filteredActivities.length > 0 ? (
              <div
                className={styles.grid}
                role="list"
                aria-label={
                  filtersActive
                    ? `${filteredActivities.length} matching activities`
                    : 'All activities'
                }
              >
                {filteredActivities.map((activity) => (
                  <div key={activity.id} role="listitem">
                    <Card
                      activity={activity}
                      highlighted={activity.isFeatured}
                      onTryThis={handleTryThis}
                      onDetails={handleDetails}
                    />
                    {triedId === activity.id && (
                      <p
                        className={styles.triedMessageInline}
                        role="status"
                        aria-live="polite"
                      >
                        ✅ Go enjoy it!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
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

      {/* ── Featured picks ─────────────────────────────── */}
      <div className={styles.featuredSection}>
        <div className={styles.featuredLabel} aria-hidden="true">
          ⭐ staff picks ⭐
        </div>
        <h3 className={styles.featuredTitle}>Today's Featured Picks</h3>
        <div
          className={styles.featuredGrid}
          role="list"
          aria-label="Featured activities"
        >
          {featuredActivities.map((activity) => (
            <div key={activity.id} role="listitem">
              <Card activity={activity} highlighted onTryThis={handleTryThis} onDetails={handleDetails} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
