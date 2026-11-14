import React from 'react';

function LandingPage({ onStartMission }) {
  return (
    <div className="landing-container">
      {/* Glow aura backdrop */}
      <div className="mars-planet-glow"></div>

      <header className="landing-header">
        <div className="badge-pill">NASA Space Apps Challenge 2026</div>
        <h1 className="landing-title">
          MARS<span className="text-orange">BOUND</span>
        </h1>
        <p className="landing-subtitle">Junior Astronaut Mission Trainer</p>
      </header>

      <section className="briefing-card">
        <h2>Mission Briefing</h2>
        <p className="briefing-text">
          Cadet, welcome aboard the <strong>Ares-VI Martian Habitat</strong>. You have been selected
          to supervise vital life-support systems on the Martian frontier.
        </p>
        <p className="briefing-text">
          Over the next <strong>10 Martian Sols</strong>, you must balance critical resources:
          <strong> Oxygen</strong>, <strong>Water</strong>, <strong>Food</strong>, and <strong>Energy</strong>.
          Every command you issue impacts your habitat and crew survival.
        </p>

        <div className="briefing-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">🫧</span>
            <div>
              <strong>Oxygen & Water</strong>
              <p>Keep air scrubbers and hydration recyclers operating.</p>
            </div>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🍎</span>
            <div>
              <strong>Food & Agriculture</strong>
              <p>Expand hydroponic greenhouses to feed the crew.</p>
            </div>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">⚡</span>
            <div>
              <strong>Energy & Shielding</strong>
              <p>Manage solar arrays and protect against solar radiation.</p>
            </div>
          </div>
        </div>

        {/* Mission Survival Thresholds */}
        {/* Commander Decisions */}
        <p className="briefing-text">
          Each Sol you may choose ONE commander decision: Improve Radiation Shielding, Expand Greenhouse, Conserve Energy, Activate Water Recycling, or Activate Oxygen Generator. Each action has different resource costs and benefits.
        </p>
        {/* Daily Consumption */}
        <p className="briefing-text">
          Every Sol the habitat automatically loses 5 Oxygen, 5 Water, and 5 Food. Energy has no daily consumption.
        </p>
        {/* Random Events */}
        <p className="briefing-text">
          Random events may appear unpredictably: Severe Dust Storm (Energy loss), Water System Leak (Water loss), Solar Power Surge (Energy gain).
        </p>
        {/* Immediate Failure */}
        <p className="briefing-text">
          If any resource reaches 0 the mission ends immediately.
        </p>
        <div className="briefing-thresholds-card">
          <h3 className="briefing-thresholds-title">🎯 Mission Survival Thresholds</h3>
          <p className="briefing-thresholds-desc">
            To achieve <strong>Mission Success</strong> after completing all 10 Sols, your habitat must maintain at least:
          </p>
          <div className="thresholds-preview-grid">
            <div className="threshold-preview-item">
              <span className="threshold-icon">🫧</span>
              <div className="threshold-meta">
                <strong>Oxygen</strong>
                <span className="threshold-target">≥ 35%</span>
              </div>
            </div>
            <div className="threshold-preview-item">
              <span className="threshold-icon">💧</span>
              <div className="threshold-meta">
                <strong>Water</strong>
                <span className="threshold-target">≥ 35%</span>
              </div>
            </div>
            <div className="threshold-preview-item">
              <span className="threshold-icon">🍎</span>
              <div className="threshold-meta">
                <strong>Food</strong>
                <span className="threshold-target">≥ 30%</span>
              </div>
            </div>
            <div className="threshold-preview-item">
              <span className="threshold-icon">⚡</span>
              <div className="threshold-meta">
                <strong>Energy</strong>
                <span className="threshold-target">≥ 25%</span>
              </div>
            </div>
          </div>
          <p className="thresholds-disclaimer">
            *Illustrative gameplay thresholds, not official NASA requirements.
          </p>
        </div>

        {/* Mars Mission Facts */}
        <section className="mars-facts-card">
          <h2>Mars Mission Facts</h2>
          <div className="facts-grid">
            <div className="fact-card">
              <strong>Mean Surface Gravity</strong>
              <p>3.73 m/s²</p>
            </div>
            <div className="fact-card">
              <strong>Atmospheric Composition</strong>
              <p>≈ 95.1 % CO₂</p>
            </div>
            <div className="fact-card">
              <strong>Length of a Martian Day</strong>
              <p>≈ 24.66 h</p>
            </div>
          </div>
          <p className="facts-attribution">
            Source: <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html" target="_blank" rel="noopener noreferrer">NASA Mars Fact Sheet</a>. These are real scientific facts; MARSBOUND’s resource values and survival mechanics are simplified educational simulations.
          </p>
        </section>
      </section>

      <div className="start-action-area">
          <button className="btn-primary start-btn" onClick={onStartMission}>
            <span className="btn-icon">🚀</span> Start Mission
          </button>
          <span className="start-hint">Prepare for habitat initialization – Sol 1 awaits</span>
        </div>
    </div>
  );
}

export default LandingPage;
