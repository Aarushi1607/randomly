import styles from './Hero.module.css';

const FLOATING_EMOJIS = ['🎨', '🎸', '🧩', '🌿', '🎲', '📚', '🎭', '🍕', '🚴', '🎯', '💃', '🧁'];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Decorative floating emojis */}
      <div className={styles.floatingEmojis} aria-hidden="true">
        {FLOATING_EMOJIS.map((emoji, i) => (
          <span
            key={emoji}
            className={styles.floatingEmoji}
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 17) % 75}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${3 + (i % 3)}s`,
              fontSize: `${1.2 + (i % 3) * 0.4}rem`,
              opacity: 0.35 + (i % 4) * 0.1,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        {/* Scrapbook label */}
        <div className={styles.eyebrow} aria-hidden="true">
          <span className={styles.eyebrowDoodle}>✦ ✦ ✦</span>
          <span>your boredom cure, delivered</span>
          <span className={styles.eyebrowDoodle}>✦ ✦ ✦</span>
        </div>

        <h1 id="hero-heading" className={styles.heading}>
          Too bored to<br />
          <span className={styles.headingAccent}>think straight?</span>
        </h1>

        <p className={styles.subheading}>
          Randomly serves up spontaneous, delightful activities to pull you out
          of your rut — from cloud-watching to midnight snack invention.
          <strong> No planning required.</strong>
        </p>

        {/* Stats ribbon */}
        <div className={styles.statsRibbon} aria-label="App highlights">
          <div className={styles.stat}>
            <span className={styles.statNum}>100+</span>
            <span className={styles.statLabel}>activities</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true">·</div>
          <div className={styles.stat}>
            <span className={styles.statNum}>7</span>
            <span className={styles.statLabel}>categories</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true">·</div>
          <div className={styles.stat}>
            <span className={styles.statNum}>0</span>
            <span className={styles.statLabel}>excuses needed</span>
          </div>
        </div>

        {/* Doodle arrow + scroll hint */}
        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollArrow}>↓</span>
          <span className={styles.scrollText}>scroll to discover</span>
        </div>
      </div>

      {/* Decorative sticker cluster */}
      <div className={styles.stickerCluster} aria-hidden="true">
        <span className={styles.stickerStar}>⭐</span>
        <span className={styles.stickerStar2}>✨</span>
        <span className={styles.stickerNote}>
          Today is the<br />perfect day
          <br />for something
          <br /><em>random!</em>
        </span>
      </div>
    </section>
  );
}
