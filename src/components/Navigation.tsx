import { useState } from 'react';
import styles from './Navigation.module.css';

interface NavLink {
  label: string;
  href: string;
  emoji: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Discover',    href: '#discover',   emoji: '🔍' },
  { label: 'Categories',  href: '#categories', emoji: '🗂️' },
  { label: 'About',       href: '#about',      emoji: '💌' },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Main navigation">
        {/* Logo */}
        <a href="#" className={styles.logo} aria-label="Randomly — home">
          <span className={styles.logoIcon} aria-hidden="true">🎲</span>
          <span className={styles.logoText}>
            <span className={styles.logoBold}>ran</span>
            <span className={styles.logoAccent}>dom</span>
            <span className={styles.logoBold}>ly</span>
          </span>
          <span className={styles.logoTagline} aria-hidden="true">✦ beat boredom ✦</span>
        </a>

        {/* Desktop nav links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ label, href, emoji }) => (
            <li key={label}>
              <a href={href} className={styles.link}>
                <span aria-hidden="true">{emoji}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href="#discover" className={styles.ctaButton} aria-label="Start discovering activities">
          Let's Go! 🚀
        </a>

        {/* Mobile hamburger */}
        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className={styles.mobileMenu}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <ul role="list">
            {NAV_LINKS.map(({ label, href, emoji }) => (
              <li key={label}>
                <a
                  href={href}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span aria-hidden="true">{emoji}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#discover"
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Let's Go! 🚀
          </a>
        </div>
      )}
    </header>
  );
}
