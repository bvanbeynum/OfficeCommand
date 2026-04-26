// /home/bvanbeynum/dev/officecommand/frontend/components/Dashboard.js

import React, { useState } from 'react';
import TemperatureChart from './TemperatureChart';
import MetricCard from './MetricCard';
import SettingsPanel from './SettingsPanel';
import AcControlPanel from './AcControlPanel';
import ErrorLogModal from './ErrorLogModal';
import { useSensor } from '../context/SensorContext';

const Dashboard = () => {
	const { currentTelemetry, historicalData, settings, selectedTimeframe, setSelectedTimeframe } = useSensor();
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const lightThreshold = settings?.lightThreshold || 150;

	// Timeframe labels for the UI
	const timeframeLabels = {
		'1h': 'Last 1 Hour',
		'5h': 'Last 5 Hours',
		'24h': 'Last 24 Hours'
	};

	// Get the last 5 logs from historical data and sort them descending by timestamp
	const recentLogs = [...(historicalData.logs || [])]
		.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
		.slice(0, 5);

	return (
		<div className="app-container">
			<header className="dashboard-header">
				<div className="header-title-container">
					<span className="header-title">Office Climate Control</span>
					<span className="header-title-divider">|</span>
					<span className="header-subtitle">TEGAS CAY, SC</span>
				</div>
				<div className="header-actions">
					<span className="header-icon" onClick={() => setIsErrorModalOpen(true)} style={{ cursor: 'pointer' }}>🔔</span>
					<span className="header-icon">🚪</span>
				</div>
			</header>

			<main className="dashboard-grid">
				{/* Column 1: Live Monitoring */}
				<div className="dashboard-column">
					<span className="column-title">Live Monitoring</span>
					<MetricCard 
						title="Current Temperature" 
						value={currentTelemetry?.temperature?.toFixed(0)} 
						unit="°F" 
						subtitle="Updated 30s ago"
						isLarge={true}
					>
						<div className="ideal-indicator">
							<span className="ideal-icon">🌡️</span>
							<span className="ideal-text">Ideal</span>
						</div>
					</MetricCard>
					
					<MetricCard 
						title="Humidity" 
						value={currentTelemetry?.humidity?.toFixed(0)} 
						unit="%" 
						subtitle="Comfortable"
						icon="💧"
					/>

					<MetricCard 
						title="Light Level" 
						value={currentTelemetry?.light < lightThreshold ? 'Lights OFF' : 'Lights ON'} 
						subtitle={`Raw value: ${currentTelemetry?.light || 0} / Threshold: ${lightThreshold}`}
						icon="💡"
					/>

					<MetricCard 
						title="Door Status" 
						value={currentTelemetry?.doorOpen ? 'Main Door: OPEN' : 'Main Door: CLOSED'} 
						subtitle="Last action: 10:15 AM"
						icon="🚪"
					/>
				</div>

				{/* Column 2: AC Unit Control */}
				<div className="dashboard-column">
					<span className="column-title">AC Unit Control (MrCool DIY)</span>
					<AcControlPanel />
				</div>

				{/* Column 3: System Data & Logs */}
				<div className="dashboard-column">
					<span className="column-title">System Data & Logs</span>
					
					<div className="card table-card">
						<div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h4 className="table-title">Environment History - {selectedTimeframe}</h4>
							<div className="btn-group" style={{ margin: 0 }}>
								{Object.keys(timeframeLabels).map(tf => (
									<button 
										key={tf}
										className={`group-btn ${selectedTimeframe === tf ? 'active' : ''}`}
										onClick={() => setSelectedTimeframe(tf)}
										style={{ padding: '4px 8px', fontSize: '0.65rem' }}
									>
										{tf.toUpperCase()}
									</button>
								))}
							</div>
						</div>
						<div style={{ padding: '30px 20px 20px 20px' }}>
							<TemperatureChart data={historicalData.logs} timeframe={selectedTimeframe} />
						</div>
					</div>

					<div className="card table-card">
						<div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h4 className="table-title">Recent Logs (MongoDB)</h4>
							<button 
								onClick={() => setIsErrorModalOpen(true)}
								style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-blue)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600' }}
							>
								VIEW ERRORS
							</button>
						</div>
						<table className="log-table">
							<thead>
								<tr>
									<th>Timestamp</th>
									<th>Temp</th>
									<th>Hum</th>
									<th>Light</th>
									<th>Door</th>
								</tr>
							</thead>
							<tbody>
								{recentLogs.length > 0 ? (
									recentLogs.map((log, i) => (
										<tr key={i}>
											<td>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
											<td>{log.temperature?.toFixed(0)}°F</td>
											<td>{log.humidity?.toFixed(0)}%</td>
											<td>{log.light < lightThreshold ? 'OFF' : 'ON'}</td>
											<td>{log.doorOpen ? '✅' : '🔒'}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>No data available</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<SettingsPanel />
				</div>
			</main>

			{isErrorModalOpen && <ErrorLogModal onClose={() => setIsErrorModalOpen(false)} />}
		</div>
	);
};

export default Dashboard;
