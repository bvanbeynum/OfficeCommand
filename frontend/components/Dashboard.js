// /home/bvanbeynum/dev/officecommand/frontend/components/Dashboard.js

import React, { useState } from 'react'; // Removed classNames import
import TemperatureChart from './TemperatureChart'; // Import TemperatureChart
import MetricCard from './MetricCard'; // Import the MetricCard component
import SettingsPanel from './SettingsPanel'; // Import SettingsPanel
import ErrorLogModal from './ErrorLogModal'; // Import ErrorLogModal
import { useSensor } from '../context/SensorContext';

// This component serves as the core layout for the dashboard, using a grid system.
const Dashboard = () => {
	// Consume context data for current telemetry
	const { currentTelemetry, settings, historicalData, selectedTimeframe, setSelectedTimeframe } = useSensor();
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

	// Helper function to render a metric card or a loading state
	const renderMetricCard = (title, value, unit, icon, status) => {
		return (
			<MetricCard
				title={title}
				value={value}
				unit={unit}
				icon={icon}
				status={status}
			/>
		);
	};

	// Determine light status based on threshold from settings
	const isLightAlert = currentTelemetry && settings && currentTelemetry.light > settings.lightThreshold;

	return (
		<main className="dashboard-grid">
			{currentTelemetry && settings ? ( // Ensure both currentTelemetry and settings are available
				<>
					<div className="timeframe-toggle-control chart-card"> {/* This card contains the chart and its controls */}
						<div className="timeframe-buttons">
							<button onClick={() => setSelectedTimeframe('1h')} // Use direct conditional class assignment
								className={`timeframe-button ${selectedTimeframe === '1h' ? 'active' : ''}`}>1h</button>
							<button onClick={() => setSelectedTimeframe('5h')} // Use direct conditional class assignment
								className={`timeframe-button ${selectedTimeframe === '5h' ? 'active' : ''}`}>5h</button>
							<button onClick={() => setSelectedTimeframe('24h')} // Use direct conditional class assignment
								className={`timeframe-button ${selectedTimeframe === '24h' ? 'active' : ''}`}>24h</button>
						</div>
						{/* Pass the historical temperature data from context */}
						<TemperatureChart historicalTemperatures={historicalData.temperature} />
					</div>

					{/* Other Metric Cards */}
					{renderMetricCard("Temperature", currentTelemetry.temperature?.toFixed(1), "°F", "🌡️")}
					{renderMetricCard("Humidity", currentTelemetry.humidity?.toFixed(1), "%", "💧")}
					{renderMetricCard("Light", currentTelemetry.light, "lux", "💡", isLightAlert ? 'light-alert' : 'normal')}
					{renderMetricCard(
						"Door State",
						currentTelemetry.doorOpen ? 'OPEN' : 'CLOSED',
						null,
						currentTelemetry.doorOpen ? '🚪' : '🔒',
						currentTelemetry.doorOpen ? 'alert' : 'normal' // Placeholder for future alert styling
					)} {/* Removed the duplicate TemperatureChart here */}

					{/* Settings Panel spanning across */}
					<SettingsPanel />

					{/* System Health / Error Log Trigger */}
					<div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '15px', marginBottom: '30px' }}>
						<button onClick={() => setIsErrorModalOpen(true)} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
							🔍 View System Error Logs
						</button>
					</div>

					{isErrorModalOpen && <ErrorLogModal onClose={() => setIsErrorModalOpen(false)} />}
				</>
			) : ( // Show loading message if either currentTelemetry or settings are null
				<p>Loading sensor data and settings...</p>
			)}
		</main>
	);
};

export default Dashboard;
