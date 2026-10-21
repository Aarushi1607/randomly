import { useState, useCallback } from 'react';
import styles from './ActivityGrid.module.css';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { mockActivities, featuredActivities, getRandomActivity, CATEGORY_LABELS } from '../data/activities';
import type { Activity, Category } from '../data/activities';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

type FilterState = 'all' | Category;

export function ActivityGrid() {
  const [pickedActivity, setPickedActivity] = useState<Activity | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filter, setFilter] = useState<FilterState>('all');
  const [triedId, setTriedId] = useState<string | null>(null);

  const handleSurpriseMe = useCallback(() => {
    setIsSpinning(true);
    setPickedActivity(null);
    setTriedId(null);

    // Simulate a brief "spinning" delay for delight
    setTimeout(() => {
      setPickedActivity(getRandomActivity());
      setIsSpinning(false);
    }, 700);
  }, []);

  const handleTryThis = useCallback((id: string) => {
    setTriedId(id);
  }, []);

  const filteredActivities =
    filter === 'all'
      ? mockActivities
      : mockActivities.filter((a) => a.category === filter);

  return (
    <section
      className={styles.section}
      id="discover"
      aria-labelledby="discover-heading"
    >
      {/* Section header */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionEyebrow} aria-hidden="true">
          🗺️ what should i do today?
        </div>
        <h2 id="discover-heading" className={styles.sectionTitle}>
          Discover Something New
        </h2>
        <p className={styles.sectionSubtitle}>
          Not feeling inspired? Hit the button and let us choose for you.
        </p>
      </div>

      {/* ── Surprise Me zone ─────────────────────────────────── */}
      <div className={styles.surpriseZone} role="region" aria-label="Random activity picker">
        <div className={styles.surpriseBox}>
          {/* Decorative doodles */}
          <span className={styles.doodleStar} aria-hidden="true">⭐</span>
          <span className={styles.doodleSparkle} aria-hidden="true">✨</span>
          <span className={styles.doodleSparkle2} aria-hidden="true">🌟</span>

          <p className={styles.surpriseTagline}>
            Feeling lucky? Let the universe decide.
          </p>

          <Button
            variant="surprise"
            size="lg"
            onClick={handleSurpriseMe}
            loading={isSpinning}
            aria-live="polite"
            aria-label="Pick a random activity for me"
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
              />
              {triedId === pickedActivity.id && (
                <p className={styles.triedMessage} role="status">
                  ✅ Awesome! Go enjoy your adventure. You can always pick again!
                </p>
              )}
            </div>
          )}

          {/* Empty prompt (initial state) */}
          {!isSpinning && !pickedActivity && (
            <p className={styles.emptyHint} aria-hidden="true">
              👆 press the button, i dare you
            </p>
          )}
        </div>
      </div>

      {/* ── Browse all activities ─────────────────────────────── */}
      <div className={styles.browseSection}>
        <div className={styles.browseHeader}>
          <h3 className={styles.browseTitle}>Or browse them all</h3>
          {/* Category filter chips */}
          <div className={styles.filters} role="group" aria-label="Filter by category">
            <button
              className={[styles.filterChip, filter === 'all' ? styles.filterActive : ''].join(' ')}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              🌈 All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={[styles.filterChip, filter === cat ? styles.filterActive : ''].join(' ')}
                onClick={() => setFilter(cat === filter ? 'all' : cat)}
                aria-pressed={filter === cat}
              >
                <Badge category={cat} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredActivities.length > 0 ? (
          <div
            className={styles.grid}
            role="list"
            aria-label={`Activities${filter !== 'all' ? ` in ${CATEGORY_LABELS[filter as Category]}` : ''}`}
          >
            {filteredActivities.map((activity) => (
              <div key={activity.id} role="listitem">
                <Card
                  activity={activity}
                  highlighted={activity.isFeatured}
                  onTryThis={handleTryThis}
                />
                {triedId === activity.id && (
                  <p className={styles.triedMessageInline} role="status" aria-live="polite">
                    ✅ Go enjoy it!
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <span className={styles.emptyEmoji} aria-hidden="true">🫥</span>
            <p>No activities in this category yet.</p>
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
              Show all activities
            </Button>
          </div>
        )}
      </div>

      {/* Featured section preview */}
      <div className={styles.featuredSection}>
        <div className={styles.featuredLabel} aria-hidden="true">
          ⭐ staff picks ⭐
        </div>
        <h3 className={styles.featuredTitle}>Today's Featured Picks</h3>
        <div className={styles.featuredGrid} role="list" aria-label="Featured activities">
          {featuredActivities.map((activity) => (
            <div key={activity.id} role="listitem">
              <Card activity={activity} highlighted onTryThis={handleTryThis} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
