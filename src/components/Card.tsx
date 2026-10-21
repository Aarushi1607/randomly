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

/* Cycle through bold card tints */
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
  onTryThis?: (id: string) => void;
  onDetails?: (id: string) => void;
}

export function Card({
  activity,
  highlighted = false,
  onTryThis,
  onDetails,
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
      ].filter(Boolean).join(' ')}
      aria-label={`Activity: ${title}`}
    >
      {/* ── Coloured top strip ── */}
      <div className={styles.topStrip}>
        <Badge category={category} size="sm" />
        <span className={styles.duration} aria-label={`Duration: ${duration}`}>
          ⏱ {duration}
        </span>
      </div>

      {/* ── Emoji sticker ── */}
      <div className={styles.emojiSticker} aria-hidden="true">
        {emoji}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {/* Hook line — one-sentence preview */}
        <p className={styles.hook}>{hook}</p>

        {/* Quick-info chips */}
        <div className={styles.metaRow} aria-label="Activity details">
          <span
            className={styles.metaChip}
            aria-label={`Budget: ${costNote}`}
            title={costNote}
          >
            {BUDGET_ICON[budget]} {costNote}
          </span>
          <span
            className={styles.metaChip}
            aria-label={`Location: ${location}`}
          >
            {LOCATION_ICON[location]} {location}
          </span>
          <span
            className={styles.metaChip}
            aria-label={`Company: ${company.join(', ')}`}
          >
            👥 {company.join(' · ')}
          </span>
        </div>

        {/* Tags */}
        <ul className={styles.tags} aria-label="Tags">
          {tags.slice(0, 3).map((tag) => (
            <li key={tag} className={styles.tag}>#{tag}</li>
          ))}
        </ul>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <span
          className={styles.difficulty}
          aria-label={`Difficulty: ${DIFFICULTY_LABELS[difficulty]}`}
        >
          <span className={[styles.dot, DIFFICULTY_DOT[difficulty]].join(' ')} aria-hidden="true" />
          {DIFFICULTY_LABELS[difficulty]}
        </span>

        <div className={styles.footerActions}>
          {onDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDetails(id)}
              aria-label={`View full details for "${title}"`}
            >
              Details
            </Button>
          )}
          {onTryThis && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onTryThis(id)}
              aria-label={`I'll do "${title}"`}
            >
              Let's Go! →
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
