import React, { useState, useRef } from 'react';
import ResourceCard from './ResourceCard';
import MissionStatus from './MissionStatus';
import DecisionControls from './DecisionControls';
import {
  INITIAL_RESOURCES,
  MAX_SOLS,
  SURVIVAL_THRESHOLDS,
  processTurn
} from '../gameLogic';

function Dashboard({ onReturnToBriefing }) {
  const [resources, setResources] = useState(() => ({ ...INITIAL_RESOURCES }));
  const [sol, setSol] = useState(1);
  const [completedTurns, setCompletedTurns] = useState(0);
  const [lastAction, setLastAction] = useState('Mission started. All systems operational at 100%.');
  const [logs, setLogs] = useState([
    {
      id: 1,
      label: 'MISSION START',
      text: 'Ares-VI Habitat life-support initialized. Oxygen, Water, Food, Energy at 100.'
    }
  ]);
  const [missionOutcome, setMissionOutcome] = useState(null); // null | 'success' | 'failure'
  const [failureReason, setFailureReason] = useState(null); // null | 'depletion' | 'threshold'
  const [depletedResources, setDepletedResources] = useState([]);
  const [thresholdFailures, setThresholdFailures] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  // Handles executing one of the commander decisions per turn
  const handleDecision = (decisionId) => {
    if (missionOutcome || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      // Clear any previously displayed event at start of decision turn
      setCurrentEvent(null);

      const currentDecisionSol = sol;

      // Process turn through decoupled game logic (includes 30% random event roll)
      const {
        nextResources,
        nextSol,
        completedTurns: turnsDone,
        outcome,
        failureReason: reason,
        depletedResources: depleted,
        thresholdFailures: failedThresholds,
        actionLog,
        event
      } = processTurn(resources, currentDecisionSol, decisionId);

      setResources(nextResources);
      setCompletedTurns(turnsDone);

      // Display the event returned for this turn, or clear if no event occurred
      setCurrentEvent(event);

      // Record decision strictly under the Sol number in which it was made
      const newLogItem = {
        id: Date.now() + Math.random(),
        sol: currentDecisionSol,
        text: `${actionLog.decisionTitle} executed. ${actionLog.explanation} Daily decay applied (-5 O2, -5 H2O, -5 Food).`
      };

      // If an event occurred, add both the event and decision entries to the log
      if (event) {
        const eventLogItem = {
          id: Date.now() + Math.random() + 0.1,
          sol: currentDecisionSol,
          label: `SOL ${currentDecisionSol} EVENT`,
          isEvent: true,
          text: `${event.title} [${event.type}]: ${event.message} (${event.impactSummary})`
        };
        setLogs((prev) => [eventLogItem, newLogItem, ...prev]);
        setLastAction(actionLog.summary);
      } else {
        setLogs((prev) => [newLogItem, ...prev]);
        setLastAction(actionLog.summary);
      }

      if (outcome === 'failure') {
        setMissionOutcome('failure');
        setFailureReason(reason);
        setDepletedResources(depleted);
        setThresholdFailures(failedThresholds);

        if (reason === 'depletion') {
          setLastAction(`CRITICAL FAILURE: ${depleted.join(', ')} depleted to 0! Mission aborted.`);
        } else {
          const failureSummary = failedThresholds
            .map((f) => `${f.resource} (${f.current}/${f.required})`)
            .join(', ');
          setLastAction(`MISSION FAILED: Sols completed but thresholds missed: ${failureSummary}`);
        }
      } else if (outcome === 'success') {
        setMissionOutcome('success');
        setFailureReason(null);
        setSol(MAX_SOLS);
        setLastAction('MISSION COMPLETE: All 10 Sols finished and all survival thresholds met! Crew survived.');
      } else {
        setSol(nextSol);
      }
    } finally {
      // Release processing guard after turn updates
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // Resets entire game back to initial state, including the event system
  const handleRestartMission = () => {
    isProcessingRef.current = false;
    setIsProcessing(false);
    setResources({ ...INITIAL_RESOURCES });
    setSol(1);
    setCompletedTurns(0);
    setMissionOutcome(null);
    setFailureReason(null);
    setDepletedResources([]);
    setThresholdFailures([]);
    setCurrentEvent(null);
    setLastAction('Mission reset. All systems restored to baseline 100%.');
    setLogs([
      {
        id: Date.now(),
        label: 'MISSION START',
        text: 'Ares-VI Habitat life-support initialized. Oxygen, Water, Food, Energy at 100.'
      }
    ]);
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="brand-dot"></span>
          <span className="brand-title">MARSBOUND</span>
          <span className="brand-badge">Mission Control</span>
        </div>
        <div className="nav-actions">
          <button className="btn-secondary nav-btn" onClick={handleRestartMission}>
            🔄 Restart Mission
          </button>
          <button className="btn-ghost nav-btn" onClick={onReturnToBriefing}>
            📜 Briefing
          </button>
        </div>
      </nav>

      {/* Mission Timeline & Status */}
      <MissionStatus
        sol={sol}
        maxSols={MAX_SOLS}
        completedTurns={completedTurns}
        missionEvent={lastAction}
        outcome={missionOutcome}
      />

      {/* RANDOM EVENT NOTIFICATION BANNER */}
      {currentEvent && (
        <div
          key={currentEvent.instanceId || `event-${currentEvent.sol}-${currentEvent.id}`}
          className={`event-notification-banner event-banner-${
            currentEvent.typeClass || 'warning'
          }`}
        >
          <div className="event-banner-content">
            <span className="event-banner-icon">{currentEvent.icon}</span>
            <div className="event-banner-details">
              <div className="event-banner-header">
                <span className="event-banner-sol-tag">SOL {currentEvent.sol} EVENT</span>
                <span
                  className={`event-banner-tag tag-${
                    currentEvent.typeClass || 'warning'
                  }`}
                >
                  {currentEvent.type.toUpperCase()}
                </span>
                <h4 className="event-banner-title">{currentEvent.title}</h4>
              </div>
              <p className="event-banner-desc">{currentEvent.message}</p>
              <div className="event-impact-badge-wrap">
                <span className="event-impact-label">Resource Impact:</span>
                <span
                  className={`impact-badge ${
                    currentEvent.typeClass === 'positive'
                      ? 'impact-pos'
                      : 'impact-neg'
                  }`}
                >
                  {currentEvent.impactSummary}
                </span>
              </div>
            </div>
          </div>
          <button
            className="event-dismiss-btn"
            onClick={() => setCurrentEvent(null)}
            title="Acknowledge and dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {missionOutcome === 'success' && (
        <div className="outcome-banner banner-victory">
          <div className="outcome-content">
            <span className="outcome-icon">🏆</span>
            <div>
              <h3>Mission Success! 10 Sols Completed</h3>
              <p>
                Outstanding work, Commander! Your Ares-VI crew survived all 10 Martian Sols and sustained all vital life-support systems above the required Mission Survival Thresholds.
              </p>
              {currentEvent && (
                <div className="outcome-event-callout">
                  <span>✨ <strong>Final Turn Event ({currentEvent.title}):</strong> {currentEvent.message} ({currentEvent.impactSummary})</span>
                </div>
              )}
              <div className="final-resources-summary">
                <span className="summary-pill summary-pill-pass">
                  🫧 Oxygen: <strong>{resources.oxygen}</strong>/100 (Threshold ≥ {SURVIVAL_THRESHOLDS.oxygen})
                </span>
                <span className="summary-pill summary-pill-pass">
                  💧 Water: <strong>{resources.water}</strong>/100 (Threshold ≥ {SURVIVAL_THRESHOLDS.water})
                </span>
                <span className="summary-pill summary-pill-pass">
                  🍎 Food: <strong>{resources.food}</strong>/100 (Threshold ≥ {SURVIVAL_THRESHOLDS.food})
                </span>
                <span className="summary-pill summary-pill-pass">
                  ⚡ Energy: <strong>{resources.energy}</strong>/100 (Threshold ≥ {SURVIVAL_THRESHOLDS.energy})
                </span>
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={handleRestartMission}>
            🔄 Restart Mission
          </button>
        </div>
      )}

      {/* FAILURE SCREEN */}
      {missionOutcome === 'failure' && (
        <div className="outcome-banner banner-defeat">
          <div className="outcome-content">
            <span className="outcome-icon">⚠️</span>
            <div>
              {failureReason === 'threshold' ? (
                <>
                  <h3>Mission Failed – Survival Thresholds Not Met</h3>
                  <p>
                    All 10 Sols were completed, but the habitat reserves failed to meet the required <strong>Mission Survival Thresholds</strong>:
                  </p>
                  <div className="failed-thresholds-callout">
                    {thresholdFailures.map((item) => (
                      <span key={item.resource} className="failed-threshold-badge">
                        ❌ {item.icon} {item.resource}: <strong>{item.current}</strong> (Required: ≥ {item.required})
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3>Mission Failed – Critical Life Support Depletion</h3>
                  <p>
                    Life support failure on <strong>Sol {sol}</strong>: {depletedResources.join(' and ')}{' '}
                    reached <strong>0</strong>. Vital habitat reserves must never deplete completely.
                  </p>
                </>
              )}
              {currentEvent && (
                <div className="outcome-event-callout outcome-event-fail">
                  <span>⚠️ <strong>Final Turn Event ({currentEvent.title}):</strong> {currentEvent.message} ({currentEvent.impactSummary})</span>
                </div>
              )}
              <div className="final-resources-summary">
                <span
                  className={`summary-pill ${
                    resources.oxygen < SURVIVAL_THRESHOLDS.oxygen ? 'summary-pill-fail' : 'summary-pill-pass'
                  }`}
                >
                  🫧 Oxygen: <strong>{resources.oxygen}</strong>/100 (Min ≥ {SURVIVAL_THRESHOLDS.oxygen})
                </span>
                <span
                  className={`summary-pill ${
                    resources.water < SURVIVAL_THRESHOLDS.water ? 'summary-pill-fail' : 'summary-pill-pass'
                  }`}
                >
                  💧 Water: <strong>{resources.water}</strong>/100 (Min ≥ {SURVIVAL_THRESHOLDS.water})
                </span>
                <span
                  className={`summary-pill ${
                    resources.food < SURVIVAL_THRESHOLDS.food ? 'summary-pill-fail' : 'summary-pill-pass'
                  }`}
                >
                  🍎 Food: <strong>{resources.food}</strong>/100 (Min ≥ {SURVIVAL_THRESHOLDS.food})
                </span>
                <span
                  className={`summary-pill ${
                    resources.energy < SURVIVAL_THRESHOLDS.energy ? 'summary-pill-fail' : 'summary-pill-pass'
                  }`}
                >
                  ⚡ Energy: <strong>{resources.energy}</strong>/100 (Min ≥ {SURVIVAL_THRESHOLDS.energy})
                </span>
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={handleRestartMission}>
            🔄 Restart Mission
          </button>
        </div>
      )}

      {/* Resource Cards Grid (4 Resources) */}
      <section className="resources-section">
        <div className="section-header">
          <h2 className="section-title">Life Support Systems</h2>
          <p className="section-subtitle">Real-time telemetry from Ares-VI habitat monitors</p>
        </div>

        <div className="resource-grid">
          <ResourceCard
            name="Oxygen"
            value={resources.oxygen}
            icon="🫧"
            description="Atmospheric O2 circulation & scrubbers"
          />
          <ResourceCard
            name="Water"
            value={resources.water}
            icon="💧"
            description="Recycled greywater & moisture extraction"
          />
          <ResourceCard
            name="Food"
            value={resources.food}
            icon="🍎"
            description="Hydroponic greens & emergency rations"
          />
          <ResourceCard
            name="Energy"
            value={resources.energy}
            icon="⚡"
            description="Solar array battery storage & reactors"
          />
        </div>
      </section>

      {/* Decision Controls */}
      <DecisionControls
        onDecision={handleDecision}
        disabled={missionOutcome !== null || isProcessing}
        resources={resources}
      />

      {/* Mission Log Feed */}
      <section className="mission-log-section">
        <h3 className="log-section-title">Mission Operations Log</h3>
        <div className="log-entries-list">
          {logs.map((entry) => (
            <div key={entry.id} className="log-item">
              <span
                className={`log-sol ${
                  entry.label === 'MISSION START'
                    ? 'log-mission-start'
                    : entry.isEvent
                    ? 'log-sol-event'
                    : ''
                }`}
              >
                {entry.label ? entry.label : `SOL ${entry.sol}`}
              </span>
              <span className="log-text">{entry.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
