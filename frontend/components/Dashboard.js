// /home/bvanbeynum/dev/officecommand/frontend/components/Dashboard.js

import React from 'react';
import MetricCard from './MetricCard'; // Import the MetricCard component
import { useSensor } from '../context/SensorContext';

// This component serves as the core layout for the dashboard, using a grid system.
const Dashboard = () => {
	// Consume context data for current telemetry
	const { currentTelemetry } = useSensor();

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

	return (
		<main className="dashboard-grid">
			{currentTelemetry ? (
				<>
					{renderMetricCard("Temperature", currentTelemetry.temperature?.toFixed(1), "°F", "🌡️")}
					{renderMetricCard("Humidity", currentTelemetry.humidity?.toFixed(1), "%", "💧")}
					{renderMetricCard("Light", currentTelemetry.light, "lux", "💡")}
					{renderMetricCard(
						"Door State",
						currentTelemetry.doorOpen ? 'OPEN' : 'CLOSED',
						null,
						currentTelemetry.doorOpen ? '🚪' : '🔒',
						currentTelemetry.doorOpen ? 'alert' : 'normal' // Placeholder for future alert styling
					)}
				</>
			) : (
				<p>Loading sensor data...</p>
			)}
		</main>
	);
};

export default Dashboard;
