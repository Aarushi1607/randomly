import styles from './Card.module.css';
import { Badge } from './Badge';
import { Button } from './Button';
import type { Activity } from '../data/activities';

const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFFICULTY_DOT: Record<Activity['difficulty'], string> = {
  easy:   styles.dotEasy,
  medium: styles.dotMedium,
  hard:   styles.dotHard,
};

const BUDGET_ICON: Record<Activity['budget'], string> = {
  free:       '🆓',
  'low-cost': '💸',
  flexible:   '💳',
};

const LOCATION_ICON: Record<Activity['location'], string> = {
  indoors:  '🏠',
  outdoors: '🌳',
  either:   '🌍',
};

const CARD_TINTS = [
  styles.tintYellow,
  styles.tintPink,
  styles.tintBlue,
  styles.tintGreen,
  styles.tintPurple,
  styles.tintOrange,
];

function tintIndex(id: string) {
  return id.charCodeAt(id.length - 1) % CARD_TINTS.length;
}

export interface CardProps {
  activity: Activity;
  highlighted?: boolean;
  /** Opens the detail modal for this activity — the primary card action */
  onDetails?: (id: string) => void;
  /** Kept for compatibility; reserved for future "mark as tried" flow */
  onTryThis?: (id: string) => void;
  isFavourite?: boolean;
  onToggleFavourite?: (id: string) => void;
  isCompleted?: boolean;
}

export function Card({
  activity,
  highlighted = false,
  onDetails,
  isFavourite = false,
  onToggleFavourite,
  isCompleted = false,
}: CardProps) {
  const {
    id,
    title,
    hook,
    emoji,
    category,
    duration,
    difficulty,
    tags,
    budget,
    location,
    company,
    costNote,
  } = activity;

  const tintClass = CARD_TINTS[tintIndex(id)];

  return (
    <article
      className={[
        styles.card,
        tintClass,
        highlighted ? styles.highlighted : '',
        isCompleted ? styles.completed : '',
      ].filter(Boolean).join(' ')}
      aria-label={`Activity: ${title}${isCompleted ? ' (completed)' : ''}`}
    >
      {/* ── Coloured top strip ── */}
      <div className={styles.topStrip}>
        <Badge category={category} size="sm" />
        <div className={styles.topStripRight}>
          {isCompleted && (
            <span className={styles.completedBadge} aria-label="Completed">✅</span>
          )}
          <span className={styles.duration} aria-label={`Duration: ${duration}`}>
            ⏱ {duration}
          </span>
        </div>
      </div>

      {/* ── Emoji sticker (decorative, top-right) ── */}
      <div className={styles.emojiSticker} aria-hidden="true">
        {emoji}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.hook}>{hook}</p>

        <div className={styles.metaRow} aria-label="Activity details">
          <span className={styles.metaChip} aria-label={`Budget: ${costNote}`} title={costNote}>
            {BUDGET_ICON[budget]} {costNote}
          </span>
          <span className={styles.metaChip} aria-label={`Location: ${location}`}>
            {LOCATION_ICON[location]} {location}
          </span>
          <span className={styles.metaChip} aria-label={`Company: ${company.join(', ')}`}>
            👥 {company.join(' · ')}
          </span>
        </div>

        <ul className={styles.tags} aria-label="Tags">
          {tags.slice(0, 3).map((tag) => (
            <li key={tag} className={styles.tag}>#{tag}</li>
          ))}
        </ul>
      </div>

      {/* ── Footer: difficulty · heart · Details button ── */}
      <div className={styles.footer}>
        <span
          className={styles.difficulty}
          aria-label={`Difficulty: ${DIFFICULTY_LABELS[difficulty]}`}
        >
          <span className={[styles.dot, DIFFICULTY_DOT[difficulty]].join(' ')} aria-hidden="true" />
          {DIFFICULTY_LABELS[difficulty]}
        </span>

        <div className={styles.footerActions}>
          {/* Heart — stops propagation so it doesn't trigger onDetails */}
          {onToggleFavourite && (
            <button
              type="button"
              className={[styles.heartBtn, isFavourite ? styles.heartActive : ''].join(' ')}
              onClick={(e) => { e.stopPropagation(); onToggleFavourite(id); }}
              aria-label={isFavourite ? `Remove "${title}" from favourites` : `Add "${title}" to favourites`}
              aria-pressed={isFavourite}
            >
              {isFavourite ? '❤️' : '🤍'}
            </button>
          )}

          {/* Let's Go opens the detail modal */}
          {onDetails && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDetails(id)}
              aria-label={`View details for "${title}"`}
            >
              Let's Go! →
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
