import React, { useState, useEffect } from 'react';
import { fetchErrors } from '../utils/api';

const ErrorLogModal = ({ onClose }) => {
	const [errorLogs, setErrorLogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadErrors = async () => {
			setIsLoading(true);
			const result = await fetchErrors();
			
			if (result.success) {
				setErrorLogs(result.data);
			} else {
				console.error("Failed to fetch error logs:", result.error);
			}
			
			setIsLoading(false);
		};
		
		loadErrors();
	}, []);

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(event) => event.stopPropagation()}>
				<div className="modal-header">
					<h2>System Error Logs</h2>
					<button onClick={onClose} className="modal-close-btn">&times;</button>
				</div>
				
				<div className="modal-body">
					{isLoading ? (
						<div className="empty-state">Loading error history...</div>
					) : errorLogs.length === 0 ? (
						<div className="empty-state">No errors logged recently. System is healthy.</div>
					) : (
						<table className="error-table">
							<thead>
								<tr>
									<th style={{ width: '180px' }}>Timestamp</th>
									<th style={{ width: '150px' }}>Source</th>
									<th>Details</th>
								</tr>
							</thead>
							<tbody>
								{errorLogs.map((logItem) => (
									<tr key={logItem._id}>
										<td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
											{new Date(logItem.timestamp).toLocaleString()}
										</td>
										<td className="error-source" style={{ fontSize: '0.75rem' }}>{logItem.source}</td>
										<td>
											{logItem.details ? (
												<div className="error-details" style={{ marginTop: 0 }}>{logItem.details}</div>
											) : (
												<div className="error-msg" style={{ color: 'var(--color-text-primary)' }}>{logItem.message}</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ErrorLogModal;
