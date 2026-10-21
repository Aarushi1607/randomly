import { useState, useCallback } from 'react';
import './App.css';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ActivityGrid } from './components/ActivityGrid';
import { Footer } from './components/Footer';
import { UserDataPanel } from './components/UserDataPanel';
import { ActivityDetail } from './components/ActivityDetail';
import { useUserData } from './lib/useUserData';
import { mockActivities } from './data/activities';
import type { Activity } from './data/activities';
import type { UserDataPanelTab } from './components/UserDataPanel';

function App() {
  const userData = useUserData();

  // ── Panel (favourites / history) ──────────────────────────
  const [panelTab,  setPanelTab]  = useState<UserDataPanelTab>('favourites');
  const [panelOpen, setPanelOpen] = useState(false);

  const openPanel = useCallback((tab: UserDataPanelTab) => {
    setPanelTab(tab);
    setPanelOpen(true);
  }, []);

  // ── Detail modal (opened from panel's history list) ───────
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);

  const openDetail = useCallback((id: string) => {
    const found = mockActivities.find((a) => a.id === id) ?? null;
    setDetailActivity(found);
  }, []);

  return (
    <div className="app-layout">
      <Navigation
        favouriteCount={userData.favouriteIds.length}
        historyCount={userData.completions.length}
        onOpenPanel={openPanel}
      />

      <main id="main-content">
        <Hero />
        <ActivityGrid userData={userData} onOpenPanel={openPanel} />
      </main>

      <Footer />

      {/* ── Favourites / History panel ─────────────────────── */}
      {panelOpen && (
        <UserDataPanel
          initialTab={panelTab}
          userData={userData}
          onClose={() => setPanelOpen(false)}
          onDetails={(id) => {
            setPanelOpen(false);
            openDetail(id);
          }}
        />
      )}

      {/* ── Detail modal opened from the panel ─────────────── */}
      {detailActivity && (
        <ActivityDetail
          activity={detailActivity}
          onClose={() => setDetailActivity(null)}
          isFavourite={userData.isFavourite(detailActivity.id)}
          onToggleFavourite={userData.toggleFavourite}
          isCompleted={userData.isCompleted(detailActivity.id)}
          onComplete={userData.completeActivity}
        />
      )}
    </div>
  );
}

export default App;
