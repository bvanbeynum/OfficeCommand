import React, { useState, useEffect } from 'react';
import { useSensor } from '../context/SensorContext';
import { postSettings } from '../utils/api';

const SettingsPanel = () => {
	const { settings, setSettings } = useSensor();
	const [localThreshold, setLocalThreshold] = useState(settings?.lightThreshold || 500);
	const [isSaving, setIsSaving] = useState(false);

	// Keep local state in sync if backend settings change independently upon polling
	useEffect(() => {
		if (settings && settings.lightThreshold !== undefined) {
			setLocalThreshold(settings.lightThreshold);
		}
	}, [settings]);

	// Update local state smoothly while dragging
	const handleSliderChange = (event) => {
		setLocalThreshold(parseInt(event.target.value, 10));
	};

	// POST the new settings only when the user finishes dragging (mouse up or touch end)
	const handleSave = async () => {
		setIsSaving(true);
		const newSettings = { ...settings, lightThreshold: localThreshold };
		
		// Optimistically update context to see the UI reflect immediately
		setSettings(newSettings);
		
		const result = await postSettings(newSettings);
		if (!result.success) {
			console.error("Failed to save settings:", result.error);
		}
		setIsSaving(false);
	};

	return (
		<div className="settings-panel metric-card" style={{ gridColumn: '1 / -1' }}>
			<div className="metric-card-header">
				<span className="metric-card-icon">⚙️</span>
				<h3 className="metric-card-title">Settings Configuration</h3>
			</div>
			<div className="setting-control" style={{ marginTop: '15px' }}>
				<label htmlFor="light-threshold" style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
					Light Alert Threshold: <strong style={{ color: 'var(--color-text-primary)' }}>{localThreshold} lux</strong>
				</label>
				<input type="range" id="light-threshold" min="0" max="1023" value={localThreshold} onChange={handleSliderChange} onMouseUp={handleSave} onTouchEnd={handleSave} disabled={isSaving} style={{ width: '100%', cursor: 'pointer' }} />
				<p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
					Adjust the threshold to determine when the Light sensor reports an active "ON" or "ALERT" state. Slide to set the desired lux boundary.
				</p>
			</div>
		</div>
	);
};

export default SettingsPanel;
