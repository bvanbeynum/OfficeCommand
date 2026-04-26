// /home/bvanbeynum/dev/officecommand/frontend/components/Dashboard.js

import React from 'react';
import { useSensor } from '../context/SensorContext';

// This component serves as the core layout for the dashboard, using a grid system.
const Dashboard = () => {
	// We can consume context data here or pass it down to child components
	const { currentTelemetry } = useSensor();

	return (
		<main className="dashboard-grid">
			<h1>Welcome to the Office Command Dashboard!</h1>
			<p>Live Telemetry: {currentTelemetry ? JSON.stringify(currentTelemetry) : 'Loading...'}</p>
			{/* Metric cards, charts, and other components will be placed within this grid */}
		</main>
	);
};

export default Dashboard;
