import React, { useState, useEffect } from 'react';
import { useSensor } from '../context/SensorContext';
import { postSettings } from '../utils/api';

const SettingsPanel = () => {
	const { settings, setSettings } = useSensor();
	const [localThreshold, setLocalThreshold] = useState(settings?.lightThreshold || 500);
	const [isSaving, setIsSaving] = useState(false);
    const [autoAc, setAutoAc] = useState(true);
    const [doorAlerts, setDoorAlerts] = useState(false);

	useEffect(() => {
		if (settings && settings.lightThreshold !== undefined) {
			setLocalThreshold(settings.lightThreshold);
		}
	}, [settings]);

	const handleSliderChange = (event) => {
		setLocalThreshold(parseInt(event.target.value, 10));
	};

	const handleSave = async () => {
		setIsSaving(true);
		const newSettings = { ...settings, lightThreshold: localThreshold };
		setSettings(newSettings);
		const result = await postSettings(newSettings);
		if (!result.success) {
			console.error("Failed to save settings:", result.error);
		}
		setIsSaving(false);
	};

	return (
		<div className="card settings-panel">
			<span className="column-title" style={{ margin: '0 0 16px 0' }}>System Settings</span>
			
            <div className="settings-item">
                <div>
                    <div className="settings-label">Light Threshold ({localThreshold} LDR)</div>
                </div>
                <div style={{ width: '120px' }}>
                    <input 
                        type="range" 
                        min="0" max="1023" 
                        value={localThreshold} 
                        onChange={handleSliderChange} 
                        onMouseUp={handleSave} 
                        onTouchEnd={handleSave} 
                        disabled={isSaving} 
                    />
                </div>
            </div>

            <div className="settings-item">
                <div>
                    <div className="settings-label">Automatic AC Control</div>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={autoAc} onChange={() => setAutoAc(!autoAc)} />
                    <span className="slider"></span>
                </label>
            </div>

            <div className="settings-item">
                <div>
                    <div className="settings-label">Alerts (Door Open)</div>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={doorAlerts} onChange={() => setDoorAlerts(!doorAlerts)} />
                    <span className="slider"></span>
                </label>
            </div>
		</div>
	);
};

export default SettingsPanel;
