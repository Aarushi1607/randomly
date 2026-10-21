import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.brand}>
          <span className={styles.brandEmoji} aria-hidden="true">🎲</span>
          <span className={styles.brandName}>randomly</span>
        </div>

        <p className={styles.tagline}>
          Made with <span aria-label="love">💛</span> to vanquish boredom, one activity at a time.
        </p>

        {/* Decorative doodles */}
        <div className={styles.doodles} aria-hidden="true">
          <span>⭐</span>
          <span>✦</span>
          <span>🌈</span>
          <span>✦</span>
          <span>⭐</span>
        </div>
      </div>
    </footer>
  );
}
