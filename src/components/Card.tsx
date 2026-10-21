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

interface CardProps {
  activity: Activity;
  /** Visually highlight as a featured / picked card */
  highlighted?: boolean;
  onTryThis?: (id: string) => void;
}

export function Card({ activity, highlighted = false, onTryThis }: CardProps) {
  const { id, title, description, emoji, category, duration, difficulty, tags } = activity;

  return (
    <article
      className={[styles.card, highlighted ? styles.highlighted : ''].filter(Boolean).join(' ')}
      aria-label={`Activity: ${title}`}
    >
      {/* Emoji sticker */}
      <div className={styles.emojiSticker} aria-hidden="true">
        {emoji}
      </div>

      {/* Header row */}
      <div className={styles.header}>
        <Badge category={category} />
        <span className={styles.duration} aria-label={`Duration: ${duration}`}>
          <span aria-hidden="true">⏱</span> {duration}
        </span>
      </div>

      {/* Title & description */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {/* Tags */}
      <ul className={styles.tags} aria-label="Tags">
        {tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            #{tag}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.difficulty} aria-label={`Difficulty: ${DIFFICULTY_LABELS[difficulty]}`}>
          <span className={[styles.dot, DIFFICULTY_DOT[difficulty]].join(' ')} aria-hidden="true" />
          {DIFFICULTY_LABELS[difficulty]}
        </span>

        {onTryThis && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTryThis(id)}
            aria-label={`Try "${title}"`}
          >
            Try this ✦
          </Button>
        )}
      </div>
    </article>
  );
}
