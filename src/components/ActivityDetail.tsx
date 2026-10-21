import { useEffect, useRef } from 'react';
import styles from './ActivityDetail.module.css';
import { Badge } from './Badge';
import type { Activity } from '../data/activities';
import {
  BUDGET_LABELS, LOCATION_LABELS, COMPANY_LABELS,
} from '../data/activities';

const DIFFICULTY_LABELS = { easy: 'Easy ●', medium: 'Medium ●●', hard: 'Hard ●●●' };

interface ActivityDetailProps {
  activity: Activity;
  onClose: () => void;
  onTryThis?: (id: string) => void;
}

export function ActivityDetail({ activity, onClose, onTryThis }: ActivityDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  // Open the native dialog (accessibility: focus trap, Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // Focus the close button on open
    closeRef.current?.focus();
  }, []);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top  ||
      e.clientY > rect.bottom;
    if (outside) onClose();
  }

  const {
    id,
    title,
    hook,
    description,
    steps,
    emoji,
    category,
    duration,
    difficulty,
    tags,
    budget,
    costNote,
    location,
    company,
    materials,
    tip,
    safetyNote,
  } = activity;

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="detail-title"
      aria-describedby="detail-description"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>

        {/* ── Header strip ──────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.bigEmoji} aria-hidden="true">{emoji}</span>
            <div>
              <Badge category={category} />
              <h2 id="detail-title" className={styles.title}>{title}</h2>
              <p className={styles.hook}>{hook}</p>
            </div>
          </div>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close activity details"
          >
            ✕
          </button>
        </div>

        {/* ── Quick stats row ────────────────────────── */}
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

        {/* ── Description ────────────────────────────── */}
        <section className={styles.section} aria-labelledby="detail-description">
          <h3 id="detail-description" className={styles.sectionTitle}>About this activity</h3>
          <p className={styles.descriptionText}>{description}</p>
        </section>

        {/* ── Steps ──────────────────────────────────── */}
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

        {/* ── Materials ──────────────────────────────── */}
        <section className={styles.section} aria-labelledby="detail-materials">
          <h3 id="detail-materials" className={styles.sectionTitle}>
            What you need
          </h3>
          {materials.length === 0 ? (
            <p className={styles.materialsNone}>
              ✅ Nothing required — you can start immediately.
            </p>
          ) : (
            <ul className={styles.materialsList}>
              {materials.map((m) => (
                <li key={m} className={styles.material}>{m}</li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Tip ────────────────────────────────────── */}
        <div className={styles.tipBox} role="note" aria-label="Pro tip">
          <span className={styles.tipIcon} aria-hidden="true">💡</span>
          <p className={styles.tipText}><strong>Pro tip:</strong> {tip}</p>
        </div>

        {/* ── Safety note (conditional) ──────────────── */}
        {safetyNote && (
          <div className={styles.safetyBox} role="note" aria-label="Safety note">
            <span className={styles.safetyIcon} aria-hidden="true">⚠️</span>
            <p className={styles.safetyText}>{safetyNote}</p>
          </div>
        )}

        {/* ── Tags ───────────────────────────────────── */}
        <ul className={styles.tagsList} aria-label="Tags">
          {tags.map((t) => (
            <li key={t} className={styles.tag}>#{t}</li>
          ))}
        </ul>

        {/* ── CTA ────────────────────────────────────── */}
        <div className={styles.cta}>
          {onTryThis && (
            <button
              type="button"
              className={styles.tryBtn}
              onClick={() => { onTryThis(id); onClose(); }}
            >
              🚀 I'm doing this!
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
