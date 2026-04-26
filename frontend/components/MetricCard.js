// /home/bvanbeynum/dev/officecommand/frontend/components/MetricCard.js

import React from 'react';

// This component displays a single metric with a visual emphasis.
// It will be designed to utilize gradients and micro-animations.
const MetricCard = ({ title, value, unit, icon, status }) => {
    // `status` prop can be used to dynamically change card appearance (e.g., alert state)
    const cardClasses = `metric-card transition-ease-in-out hover-scale-103 hover-shadow-expand ${status ? `metric-card--${status}` : ''}`;

    return (
        <div className={cardClasses}>
            <div className="metric-card-header">
                {icon && <span className="metric-card-icon">{icon}</span>}
                <h3 className="metric-card-title">{title}</h3>
            </div>
            <div className="metric-card-value-container">
                <span className="metric-card-value">{value !== undefined && value !== null ? value : '--'}</span>
                {unit && <span className="metric-card-unit">{unit}</span>}
            </div>
            {/* Placeholder for potential additional info or sparkline charts */}
            <div className="metric-card-footer">
                {/* Footer content if any */}
            </div>
        </div>
    );
};

export default MetricCard;
