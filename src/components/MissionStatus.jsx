import React from 'react';

function MissionStatus({ sol, maxSols = 10, completedTurns = 0, missionEvent, outcome = null }) {
  // Progress is strictly based on completed turns: 0/10 -> 0%, 1/10 -> 10%, ..., 10/10 -> 100%
  const progressPercent = Math.min(100, Math.round((completedTurns / maxSols) * 100));

  // Clear labeling for current state vs completed turns
  let headerLabel = `CURRENT MISSION SOL (TURN ${completedTurns + 1} OF ${maxSols})`;
  let turnsText = `${completedTurns} of ${maxSols} Sols Completed`;

  if (outcome === 'success') {
    headerLabel = 'MISSION COMPLETE';
    turnsText = '10 of 10 Sols Concluded';
  } else if (outcome === 'failure') {
    headerLabel = 'MISSION TERMINATED';
    turnsText = `Critical failure on Sol ${sol}`;
  }

  return (
    <div className="mission-status-panel">
      <div className="mission-status-top">
        <div className="location-tag">
          <span className={`blinking-dot ${outcome === 'failure' ? 'dot-critical' : ''}`}></span>
          <span>ARES-VI HABITAT • JEZERO CRATER, MARS</span>
        </div>
        <div className="sol-badge">
          <span className="sol-label">{headerLabel}</span>
          <div className="sol-value-row">
            <span className="sol-value">
              Sol {sol} <span className="sol-max">of {maxSols}</span>
            </span>
          </div>
          <span className="turns-completed-text">{turnsText}</span>
        </div>
      </div>

      <div className="timeline-tracker">
        <div className="timeline-bar-bg">
          <div
            className="timeline-bar-progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="timeline-dots">
          {Array.from({ length: maxSols }, (_, i) => {
            const stepSol = i + 1;
            const isCompleted = stepSol <= completedTurns;
            const isCurrent = stepSol === sol && outcome !== 'success';
            return (
              <span
                key={stepSol}
                className={`timeline-dot ${isCompleted ? 'completed' : ''} ${
                  isCurrent ? 'current' : ''
                }`}
                title={`Sol ${stepSol} (${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'})`}
              >
                {stepSol}
              </span>
            );
          })}
        </div>
      </div>

      {/* Mission Survival Thresholds Display */}
      <div className="survival-thresholds-panel">
        <div className="thresholds-header">
          <span className="thresholds-title">MISSION SURVIVAL THRESHOLDS:</span>
          <span className="thresholds-note">Illustrative gameplay thresholds, not official NASA requirements.</span>
        </div>
        <div className="thresholds-tags-row">
          <span className="threshold-pill">🫧 Oxygen: ≥ 35</span>
          <span className="threshold-pill">💧 Water: ≥ 35</span>
          <span className="threshold-pill">🍎 Food: ≥ 30</span>
          <span className="threshold-pill">⚡ Energy: ≥ 25</span>
        </div>
      </div>

      {missionEvent && (
        <div className="telemetry-feed">
          <span className="telemetry-label">LATEST TELEMETRY:</span>
          <span className="telemetry-text">{missionEvent}</span>
        </div>
      )}
    </div>
  );
}

export default MissionStatus;
