import { useState } from 'react';
import styles from './Navigation.module.css';
import type { UserDataPanelTab } from './UserDataPanel';

interface NavLink {
  label: string;
  href: string;
  emoji: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Discover',   href: '#discover',   emoji: '🔍' },
  { label: 'Categories', href: '#categories', emoji: '🗂️' },
  { label: 'About',      href: '#about',      emoji: '💌' },
];

interface NavigationProps {
  favouriteCount?: number;
  historyCount?: number;
  onOpenPanel?: (tab: UserDataPanelTab) => void;
  onOpenAuth?: () => void;
  onOpenAuthSignUp?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string | null;
}

export function Navigation({
  favouriteCount = 0,
  historyCount   = 0,
  onOpenPanel,
  onOpenAuth,
  onOpenAuthSignUp,
  isAuthenticated = false,
  userEmail,
}: NavigationProps) {
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

        {/* Icon buttons: user + favourites + history */}
        <div className={styles.iconGroup}>
          {isAuthenticated ? (
            /* User account dropdown when logged in */
            <button
              type="button"
              className={styles.accountBtn}
              onClick={onOpenAuth}
              aria-label={userEmail ?? 'Account'}
            >
              <span aria-hidden="true">👤</span>
              <span className={styles.accountLabel}>{userEmail?.split('@')[0] || 'Account'}</span>
            </button>
          ) : (
            /* Sign In / Sign Up button for logged out users */
            onOpenAuth && (
              <button
                type="button"
                className={styles.authBtn}
                onClick={onOpenAuth}
              >
                Sign In / Sign Up
              </button>
            )
          )}

          {onOpenPanel && (
            <>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => onOpenPanel('favourites')}
                aria-label={`Favourites${favouriteCount > 0 ? ` (${favouriteCount})` : ''}`}
              >
                <span aria-hidden="true">❤️</span>
                {favouriteCount > 0 && (
                  <span className={styles.iconBadge} aria-hidden="true">
                    {favouriteCount > 99 ? '99+' : favouriteCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => onOpenPanel('history')}
                aria-label={`Activity history${historyCount > 0 ? ` (${historyCount})` : ''}`}
              >
                <span aria-hidden="true">✅</span>
                {historyCount > 0 && (
                  <span className={styles.iconBadge} aria-hidden="true">
                    {historyCount > 99 ? '99+' : historyCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

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
            {/* Mobile auth buttons */}
            {isAuthenticated ? (
              <li>
                <button
                  type="button"
                  className={styles.mobileLink}
                  onClick={() => { onOpenAuth?.(); setMenuOpen(false); }}
                >
                  <span aria-hidden="true">👤</span>
                  Account ({userEmail?.split('@')[0]})
                </button>
              </li>
            ) : (
              <>
                {onOpenAuthSignUp && (
                  <li>
                    <button
                      type="button"
                      className={[styles.mobileLink, styles.mobileSignUpLink].join(' ')}
                      onClick={() => { onOpenAuthSignUp(); setMenuOpen(false); }}
                    >
                      <span aria-hidden="true">✦</span>
                      Sign Up
                    </button>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className={styles.mobileLink}
                    onClick={() => { onOpenAuth?.(); setMenuOpen(false); }}
                  >
                    <span aria-hidden="true">🔐</span>
                    Sign In
                  </button>
                </li>
              </>
            )}

            {onOpenPanel && (
              <>
                <li>
                  <button
                    type="button"
                    className={styles.mobileLink}
                    onClick={() => { onOpenPanel('favourites'); setMenuOpen(false); }}
                  >
                    <span aria-hidden="true">❤️</span>
                    Favourites {favouriteCount > 0 && `(${favouriteCount})`}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={styles.mobileLink}
                    onClick={() => { onOpenPanel('history'); setMenuOpen(false); }}
                  >
                    <span aria-hidden="true">✅</span>
                    History {historyCount > 0 && `(${historyCount})`}
                  </button>
                </li>
              </>
            )}
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
