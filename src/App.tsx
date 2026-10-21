import './App.css';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ActivityGrid } from './components/ActivityGrid';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="app-layout">
      <Navigation />
      <main id="main-content">
        <Hero />
        <ActivityGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
