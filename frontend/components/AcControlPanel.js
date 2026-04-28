import React, { useState } from 'react';

const AcControlPanel = () => {
    const [targetTemp, setTargetTemp] = useState(72);
    const [mode, setMode] = useState('Cool');
    const [fanSpeed, setFanSpeed] = useState('Low');
    const [isOn, setIsOn] = useState(true);

    const modes = ['Cool', 'Dry', 'Fan', 'Auto'];
    const fanSpeeds = ['Low', 'Med', 'High', 'Auto'];

    return (
        <div className="card ac-control-panel">
            <div className="ac-control-grid">
                <div>
                    <div className="ac-stat-label">Current Status</div>
                    <div className="ac-stat-value">
                        <span className={`status-dot ${isOn ? 'on' : ''}`}></span>
                        {isOn ? 'ON' : 'OFF'}
                    </div>
                    <div className="ac-stat-label" style={{ marginTop: '8px' }}>• Cooling Mode</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="ac-stat-label">Current Temp</div>
                    <div className="ac-stat-value" style={{ fontSize: '1.5rem' }}>73°F</div>
                </div>
            </div>

            <div className="control-label" style={{ textAlign: 'center' }}>Target Temperature</div>
            <div className="target-temp-container">
                <button className="temp-btn" onClick={() => setTargetTemp(prev => prev - 1)}>−</button>
                <div className="target-temp-display">{targetTemp}°F</div>
                <button className="temp-btn" onClick={() => setTargetTemp(prev => prev + 1)}>+</button>
            </div>

            <div className="control-group">
                <label className="control-label">Mode</label>
                <div className="btn-group">
                    {modes.map(m => (
                        <button 
                            key={m} 
                            className={`group-btn ${mode === m ? 'active' : ''}`}
                            onClick={() => setMode(m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="control-group">
                <label className="control-label">Fan Speed</label>
                <div className="btn-group">
                    {fanSpeeds.map(s => (
                        <button 
                            key={s} 
                            className={`group-btn ${fanSpeed === s ? 'active' : ''}`}
                            onClick={() => setFanSpeed(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="power-toggle-container">
                <span className="power-label">POWER ON/OFF</span>
                <label className="switch">
                    <input type="checkbox" checked={isOn} onChange={() => setIsOn(!isOn)} />
                    <span className="slider"></span>
                </label>
            </div>

            <div className="ac-stat-label" style={{ marginTop: '20px', fontSize: '0.65rem' }}>
                Last IR Command: 'Power ON' sent via PI 2 at 10:30 AM (Success)
            </div>
        </div>
    );
};

export default AcControlPanel;
