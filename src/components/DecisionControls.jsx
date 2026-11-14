import React from 'react';
import { DECISIONS } from '../gameLogic';

function DecisionControls({ onDecision, disabled = false, resources }) {
  const decisionList = Object.values(DECISIONS);

  return (
    <div className="decisions-section">
      <div className="section-header">
        <h2 className="section-title">Commander Decisions</h2>
        <p className="section-subtitle">
          Review the complete resource impact before executing each Sol order (Direct Action + Daily Consumption = Final Net Change).
        </p>
      </div>

      <div className="decisions-grid">
        {decisionList.map((decision) => {
          let isRequirementsInsufficient = false;
          let requirementWarning = '';

          if (decision.requirements && resources) {
            const missing = [];
            if (decision.requirements.energy && resources.energy < decision.requirements.energy) {
              missing.push(`${decision.requirements.energy} Energy (Current: ${resources.energy})`);
            }
            if (decision.requirements.water && resources.water < decision.requirements.water) {
              missing.push(`${decision.requirements.water} Water (Current: ${resources.water})`);
            }
            if (missing.length > 0) {
              isRequirementsInsufficient = true;
              requirementWarning = `⚠️ Minimum required: ${missing.join(', ')}`;
            }
          } else if (
            decision.minEnergyRequired &&
            resources &&
            resources.energy < decision.minEnergyRequired
          ) {
            isRequirementsInsufficient = true;
            requirementWarning = `⚠️ Minimum 15 Energy required (Current: ${resources?.energy})`;
          }

          const isButtonDisabled = disabled || isRequirementsInsufficient;

          return (
            <button
              key={decision.id}
              type="button"
              className={`decision-card-btn ${isRequirementsInsufficient ? 'decision-card-disabled' : ''}`}
              disabled={isButtonDisabled}
              onClick={() => onDecision(decision.id)}
            >
              <div className="decision-card-top">
                <span className="decision-icon">{decision.icon}</span>
                <h3 className="decision-title">{decision.title}</h3>
              </div>

              <p className="decision-desc">{decision.description}</p>

              {/* Complete Resource Impact Breakdown */}
              <div className="decision-impact-table">
                <div className="impact-table-head">
                  <span className="col-res">Resource</span>
                  <span className="col-val">Action</span>
                  <span className="col-val">Daily</span>
                  <span className="col-val col-net-head">Net / Sol</span>
                </div>

                {decision.impacts.map((row) => (
                  <div key={row.resource} className="impact-table-row">
                    <span className="col-res res-name-cell">
                      <span className="res-mini-icon">{row.icon}</span>
                      <span>{row.resource}</span>
                    </span>

                    <span
                      className={`col-val ${
                        row.action.startsWith('+')
                          ? 'val-pos'
                          : row.action.startsWith('-')
                          ? 'val-neg'
                          : 'val-dim'
                      }`}
                    >
                      {row.action}
                    </span>

                    <span
                      className={`col-val ${
                        row.daily.startsWith('-') ? 'val-neg' : 'val-dim'
                      }`}
                    >
                      {row.daily}
                    </span>

                    <span className={`col-val col-net-badge net-${row.type}`}>
                      {row.netText}
                    </span>
                  </div>
                ))}
              </div>

              {isRequirementsInsufficient && (
                <div className="energy-requirement-notice">
                  {requirementWarning}
                </div>
              )}

              <div className="decision-execute-action">
                <span>{isRequirementsInsufficient ? 'Requirements Not Met' : 'Execute Order'}</span>
                <span className="execute-arrow">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DecisionControls;
