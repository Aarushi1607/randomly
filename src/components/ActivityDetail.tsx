import { useEffect, useRef } from 'react';
import styles from './ActivityDetail.module.css';
import { Badge } from './Badge';
import type { Activity } from '../data/activities';
import {
  BUDGET_LABELS, LOCATION_LABELS, COMPANY_LABELS,
} from '../data/activities';

const DIFFICULTY_LABELS = { easy: 'Easy ●', medium: 'Medium ●●', hard: 'Hard ●●●' };

export interface ActivityDetailProps {
  activity: Activity;
  onClose: () => void;
  onTryThis?: (id: string) => void;
  /** Whether this activity is currently favourited */
  isFavourite?: boolean;
  /** Called when the heart button is pressed */
  onToggleFavourite?: (id: string) => void;
  /** Whether the activity has been completed (any number of times) */
  isCompleted?: boolean;
  /** Mark this activity as completed */
  onComplete?: (id: string) => void;
}

export function ActivityDetail({
  activity,
  onClose,
  onTryThis,
  isFavourite = false,
  onToggleFavourite,
  isCompleted = false,
  onComplete,
}: ActivityDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, []);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (outside) onClose();
  }

  const {
    id, title, hook, description, steps, emoji, category,
    duration, difficulty, tags, budget, costNote, location,
    company, materials, tip, safetyNote,
  } = activity;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="detail-title"
      aria-describedby="detail-description"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ──────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.bigEmoji} aria-hidden="true">{emoji}</span>
            <div>
              <Badge category={category} />
              <h2 id="detail-title" className={styles.title}>{title}</h2>
              <p className={styles.hook}>{hook}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {/* Favourite toggle */}
            {onToggleFavourite && (
              <button
                type="button"
                className={[styles.heartBtn, isFavourite ? styles.heartActive : ''].join(' ')}
                onClick={() => onToggleFavourite(id)}
                aria-pressed={isFavourite}
                aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              >
                {isFavourite ? '❤️' : '🤍'}
              </button>
            )}
            <button
              ref={closeRef}
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close activity details"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Stats ───────────────────────────── */}
        <div className={styles.statsRow} aria-label="Activity at a glance">
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">⏱</span>
            <span className={styles.statLabel}>Duration</span>
            <span className={styles.statValue}>{duration}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">💰</span>
            <span className={styles.statLabel}>Cost</span>
            <span className={styles.statValue}>{costNote}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">
              {budget === 'free' ? '🆓' : budget === 'low-cost' ? '💸' : '💳'}
            </span>
            <span className={styles.statLabel}>Budget</span>
            <span className={styles.statValue}>{BUDGET_LABELS[budget]}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">
              {location === 'indoors' ? '🏠' : location === 'outdoors' ? '🌳' : '🌍'}
            </span>
            <span className={styles.statLabel}>Where</span>
            <span className={styles.statValue}>{LOCATION_LABELS[location]}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">👥</span>
            <span className={styles.statLabel}>Who</span>
            <span className={styles.statValue}>
              {company.map((c) => COMPANY_LABELS[c]).join(', ')}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">🎯</span>
            <span className={styles.statLabel}>Difficulty</span>
            <span className={styles.statValue}>{DIFFICULTY_LABELS[difficulty]}</span>
          </div>
        </div>

        {/* ── Description ─────────────────────── */}
        <section className={styles.section} aria-labelledby="detail-description">
          <h3 id="detail-description" className={styles.sectionTitle}>About this activity</h3>
          <p className={styles.descriptionText}>{description}</p>
        </section>

        {/* ── Steps ───────────────────────────── */}
        <section className={styles.section} aria-labelledby="detail-steps">
          <h3 id="detail-steps" className={styles.sectionTitle}>How to get started</h3>
          <ol className={styles.stepsList}>
            {steps.map((step, i) => (
              <li key={i} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* ── Materials ───────────────────────── */}
        <section className={styles.section} aria-labelledby="detail-materials">
          <h3 id="detail-materials" className={styles.sectionTitle}>What you need</h3>
          {materials.length === 0 ? (
            <p className={styles.materialsNone}>✅ Nothing required — you can start immediately.</p>
          ) : (
            <ul className={styles.materialsList}>
              {materials.map((m) => (
                <li key={m} className={styles.material}>{m}</li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Tip ─────────────────────────────── */}
        <div className={styles.tipBox} role="note" aria-label="Pro tip">
          <span className={styles.tipIcon} aria-hidden="true">💡</span>
          <p className={styles.tipText}><strong>Pro tip:</strong> {tip}</p>
        </div>

        {/* ── Safety note ─────────────────────── */}
        {safetyNote && (
          <div className={styles.safetyBox} role="note" aria-label="Safety note">
            <span className={styles.safetyIcon} aria-hidden="true">⚠️</span>
            <p className={styles.safetyText}>{safetyNote}</p>
          </div>
        )}

        {/* ── Tags ────────────────────────────── */}
        <ul className={styles.tagsList} aria-label="Tags">
          {tags.map((t) => (
            <li key={t} className={styles.tag}>#{t}</li>
          ))}
        </ul>

        {/* ── CTA row ─────────────────────────── */}
        <div className={styles.cta}>
          {/* Primary: mark as done */}
          {onComplete && (
            <button
              type="button"
              className={isCompleted ? styles.completedBtn : styles.tryBtn}
              onClick={() => { onComplete(id); }}
              aria-label={isCompleted ? 'Mark as done again' : 'Mark as done'}
            >
              {isCompleted ? '✅ Done again!' : '🚀 I did this!'}
            </button>
          )}

          {/* Secondary: "Let's go" / try this */}
          {onTryThis && (
            <button
              type="button"
              className={styles.tryBtnSecondary}
              onClick={() => { onTryThis(id); onClose(); }}
              aria-label={`Start "${title}"`}
            >
              Let's go →
            </button>
          )}

          <button
            type="button"
            className={styles.dismissBtn}
            onClick={onClose}
          >
            Maybe later
          </button>
        </div>

      </div>
    </dialog>
  );
}
