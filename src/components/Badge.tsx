import styles from './Badge.module.css';
import { CATEGORY_LABELS, type Category } from '../data/activities';

interface BadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CATEGORY_EMOJI: Record<Category, string> = {
  outdoor:  '🌿',
  creative: '🎨',
  social:   '🫂',
  learning: '📚',
  wellness: '✨',
  food:     '🍴',
  gaming:   '🎮',
};

export function Badge({ category, size = 'md' }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[category], styles[size]].join(' ')}
      aria-label={`Category: ${CATEGORY_LABELS[category]}`}
    >
      <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
