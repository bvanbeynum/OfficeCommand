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
									<th>Timestamp</th>
									<th>Source</th>
									<th>Message</th>
								</tr>
							</thead>
							<tbody>
								{errorLogs.map((logItem) => (
									<tr key={logItem._id}>
										<td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
											{new Date(logItem.timestamp).toLocaleString()}
										</td>
										<td className="error-source">{logItem.source}</td>
										<td>
											<div className="error-msg">{logItem.message}</div>
											{logItem.details && (
												<div className="error-details">{logItem.details}</div>
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
