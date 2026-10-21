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

/* Cycle through bold card tints — gives each card distinct personality */
const CARD_TINTS = [
  styles.tintYellow,
  styles.tintPink,
  styles.tintBlue,
  styles.tintGreen,
  styles.tintPurple,
  styles.tintOrange,
];

/* Stable index from activity id (last char code) */
function tintIndex(id: string) {
  return id.charCodeAt(id.length - 1) % CARD_TINTS.length;
}

interface CardProps {
  activity: Activity;
  highlighted?: boolean;
  onTryThis?: (id: string) => void;
}

export function Card({ activity, highlighted = false, onTryThis }: CardProps) {
  const { id, title, description, emoji, category, duration, difficulty, tags } = activity;
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
      {/* ── Coloured top strip (category label bar) ── */}
      <div className={styles.topStrip}>
        <Badge category={category} size="sm" />
        <span className={styles.duration} aria-label={`Duration: ${duration}`}>
          ⏱ {duration}
        </span>
      </div>

      {/* ── Emoji sticker — oversized, overlapping top strip ── */}
      <div className={styles.emojiSticker} aria-hidden="true">
        {emoji}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {/* Tags */}
        <ul className={styles.tags} aria-label="Tags">
          {tags.map((tag) => (
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
        {onTryThis && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTryThis(id)}
            aria-label={`Try "${title}"`}
          >
            Let's Go! →
          </Button>
        )}
      </div>
    </article>
  );
}
