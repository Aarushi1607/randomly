import { useState, useRef, useEffect } from 'react';
import styles from './UserDataPanel.module.css';
import { Card } from './Card';
import { mockActivities } from '../data/activities';
import type { UserDataActions } from '../lib/useUserData';
import type { Activity } from '../data/activities';
import type { CompletionRecord } from '../lib/storage';

export type UserDataPanelTab = 'favourites' | 'history';

interface UserDataPanelProps {
  initialTab?: UserDataPanelTab;
  userData: UserDataActions;
  onClose: () => void;
  onDetails: (id: string) => void;
}

/** Map activity ids to Activity objects, preserving order */
function resolveActivities(ids: readonly string[]): Activity[] {
  return ids
    .map((id) => mockActivities.find((a) => a.id === id))
    .filter((a): a is Activity => a !== undefined);
}

/** Format ISO timestamp to a friendly string */
function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
      hour:  '2-digit',
      minute:'2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function UserDataPanel({
  initialTab = 'favourites',
  userData,
  onClose,
  onDetails,
}: UserDataPanelProps) {
  const [activeTab, setActiveTab] = useState<UserDataPanelTab>(initialTab);
  const [confirmClear, setConfirmClear] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  // Open native dialog for focus-trap + Escape
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (!d.open) d.showModal();
    closeRef.current?.focus();
  }, []);

  // Keep initialTab in sync — panel is unmounted/remounted by parent so
  // initialTab only applies on mount; no effect needed.

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (outside) onClose();
  }

  function handleClearHistory() {
    if (!confirmClear) { setConfirmClear(true); return; }
    userData.clearHistory();
    setConfirmClear(false);
  }

  const favouriteActivities  = resolveActivities(userData.favouriteIds);
  const completionActivities = userData.completions
    .map((c) => ({
      record:   c,
      activity: mockActivities.find((a) => a.id === c.activityId),
    }))
    .filter((x): x is { record: CompletionRecord; activity: Activity } =>
      x.activity !== undefined
    );

  // Dedupe for display — count how many times each activity was completed
  const completionCounts = new Map<string, number>();
  for (const c of userData.completions) {
    completionCounts.set(c.activityId, (completionCounts.get(c.activityId) ?? 0) + 1);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={activeTab === 'favourites' ? 'Your favourites' : 'Activity history'}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ──────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.tabs} role="tablist" aria-label="View section">
            <button
              role="tab"
              aria-selected={activeTab === 'favourites'}
              className={[styles.tab, activeTab === 'favourites' ? styles.tabActive : ''].join(' ')}
              onClick={() => { setActiveTab('favourites'); setConfirmClear(false); }}
              aria-controls="panel-favourites"
            >
              ❤️ Favourites
              {userData.favouriteIds.length > 0 && (
                <span className={styles.tabCount}>{userData.favouriteIds.length}</span>
              )}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'history'}
              className={[styles.tab, activeTab === 'history' ? styles.tabActive : ''].join(' ')}
              onClick={() => { setActiveTab('history'); setConfirmClear(false); }}
              aria-controls="panel-history"
            >
              ✅ History
              {userData.completions.length > 0 && (
                <span className={styles.tabCount}>{userData.completions.length}</span>
              )}
            </button>
          </div>

          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* ── Favourites tab ───────────────────────── */}
        <div
          id="panel-favourites"
          role="tabpanel"
          aria-label="Favourites"
          hidden={activeTab !== 'favourites'}
          className={styles.panel}
        >
          {favouriteActivities.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji} aria-hidden="true">💔</span>
              <p className={styles.emptyTitle}>No favourites yet!</p>
              <p className={styles.emptySubtitle}>
                Tap the ❤️ heart on any activity to save it here.
              </p>
            </div>
          ) : (
            <>
              <p className={styles.panelMeta}>
                {favouriteActivities.length} saved activit{favouriteActivities.length === 1 ? 'y' : 'ies'}
              </p>
              <div className={styles.cardGrid}>
                {favouriteActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    activity={activity}
                    isFavourite={true}
                    onToggleFavourite={userData.toggleFavourite}
                    onDetails={onDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── History tab ──────────────────────────── */}
        <div
          id="panel-history"
          role="tabpanel"
          aria-label="Activity history"
          hidden={activeTab !== 'history'}
          className={styles.panel}
        >
          {completionActivities.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyEmoji} aria-hidden="true">📭</span>
              <p className={styles.emptyTitle}>Nothing completed yet.</p>
              <p className={styles.emptySubtitle}>
                Open any activity and hit "I did this!" to track your progress.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.historyMeta}>
                <p className={styles.panelMeta}>
                  {userData.completions.length} completion{userData.completions.length !== 1 ? 's' : ''}
                  {' '}across {completionCounts.size} activit{completionCounts.size !== 1 ? 'ies' : 'y'}
                </p>
                <button
                  type="button"
                  className={confirmClear ? styles.confirmBtn : styles.clearBtn}
                  onClick={handleClearHistory}
                  aria-label={confirmClear ? 'Confirm clear history' : 'Clear activity history'}
                >
                  {confirmClear ? '⚠️ Are you sure? Tap again to confirm' : '🗑️ Clear history'}
                </button>
              </div>

              <ul className={styles.historyList} aria-label="Completed activities">
                {completionActivities.map(({ record, activity }) => (
                  <li key={`${record.activityId}-${record.completedAt}`} className={styles.historyItem}>
                    <span className={styles.historyEmoji} aria-hidden="true">
                      {activity.emoji}
                    </span>
                    <div className={styles.historyInfo}>
                      <button
                        type="button"
                        className={styles.historyTitle}
                        onClick={() => onDetails(activity.id)}
                        aria-label={`View details for ${activity.title}`}
                      >
                        {activity.title}
                      </button>
                      <span className={styles.historyDate}>
                        {formatDate(record.completedAt)}
                      </span>
                    </div>
                    <div className={styles.historyRight}>
                      {(completionCounts.get(activity.id) ?? 1) > 1 && (
                        <span
                          className={styles.historyCount}
                          aria-label={`Completed ${completionCounts.get(activity.id)} times total`}
                        >
                          ×{completionCounts.get(activity.id)}
                        </span>
                      )}
                      <span className={styles.historyCheck} aria-hidden="true">✅</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

      </div>
    </dialog>
  );
}
