// /home/bvanbeynum/dev/officecommand/frontend/components/Dashboard.js

import React, { useState } from 'react';
import TemperatureChart from './TemperatureChart';
import MetricCard from './MetricCard';
import SettingsPanel from './SettingsPanel';
import AcControlPanel from './AcControlPanel';
import ErrorLogModal from './ErrorLogModal';
import { useSensor } from '../context/SensorContext';

const Dashboard = () => {
	const { currentTelemetry, historicalData } = useSensor();
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

	const mockLogs = [
		{ timestamp: '2023-08-25 16:30', temp: '73°F', hum: '51', light: 'OFF', door: true },
		{ timestamp: '2023-08-25 15:30', temp: '73°F', hum: '48', light: 'OFF', door: true },
	];

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
						value={currentTelemetry?.light < 150 ? 'Lights OFF' : 'Lights ON'} 
						subtitle={`Raw value: ${currentTelemetry?.light || 0} / Threshold: 150`}
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
						<div className="table-header">
							<h4 className="table-title">Temperature History - 24hr</h4>
						</div>
						<div style={{ padding: '20px' }}>
							<TemperatureChart historicalTemperatures={historicalData.temperature} />
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
								{mockLogs.map((log, i) => (
									<tr key={i}>
										<td>{log.timestamp}</td>
										<td>{log.temp}</td>
										<td>{log.hum}</td>
										<td>{log.light}</td>
										<td>{log.door ? '✅' : '❌'}</td>
									</tr>
								))}
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
