import React from 'react';

function ResourceCard({ name, value, icon, description }) {
  // Clamp value between 0 and 100 for safety
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  // Determine status label and style class
  let statusText = 'Optimal';
  let statusClass = 'status-optimal';

  if (safeValue <= 15) {
    statusText = 'Critical';
    statusClass = 'status-critical';
  } else if (safeValue <= 35) {
    statusText = 'Warning';
    statusClass = 'status-warning';
  } else if (safeValue <= 65) {
    statusText = 'Stable';
    statusClass = 'status-stable';
  }

  return (
    <div className={`resource-card ${statusClass}`}>
      <div className="resource-header">
        <div className="resource-title-wrap">
          <span className="resource-icon" role="img" aria-label={name}>
            {icon}
          </span>
          <h3 className="resource-name">{name}</h3>
        </div>
        <span className={`resource-status-badge ${statusClass}`}>{statusText}</span>
      </div>

      <div className="resource-value-display">
        <span className="resource-number">{safeValue}</span>
        <span className="resource-unit">/ 100</span>
      </div>

      <div className="resource-bar-container">
        <div
          className={`resource-bar-fill fill-${name.toLowerCase()}`}
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>

      {description && <p className="resource-desc">{description}</p>}
    </div>
  );
}

export default ResourceCard;
