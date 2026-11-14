import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  // Current view: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="app-container">
      {/* Background Starfield Canvas/Dots */}
      <div className="stars-layer"></div>

      {currentView === 'landing' ? (
        <LandingPage onStartMission={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onReturnToBriefing={() => setCurrentView('landing')} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          MARSBOUND • NASA Space Apps Challenge 2026 • Designed for Junior Astronauts
        </p>
      </footer>
    </div>
  );
}

export default App;
