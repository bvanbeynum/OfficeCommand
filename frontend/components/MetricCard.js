// /home/bvanbeynum/dev/officecommand/frontend/components/MetricCard.js

import React from 'react';

const MetricCard = ({ title, value, unit, subtitle, icon, isLarge, children }) => {
    const cardClasses = `card metric-card ${isLarge ? 'metric-card-large' : ''}`;

    return (
        <div className={cardClasses}>
            <div className="metric-card-header">
                <h3 className="metric-card-title">{title}</h3>
                {icon && <span className="metric-card-icon">{icon}</span>}
            </div>
            <div className="metric-card-content">
                <span className="metric-card-value">{value !== undefined && value !== null ? value : '--'}</span>
                {unit && <span className="metric-card-unit">{unit}</span>}
                {children}
            </div>
            {subtitle && <div className="metric-card-subtitle">{subtitle}</div>}
        </div>
    );
};

export default MetricCard;
