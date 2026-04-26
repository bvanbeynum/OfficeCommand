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
		<div className="auth-modal-overlay" onClick={onClose}>
			<div className="auth-modal-content error-modal-content" onClick={(event) => event.stopPropagation()}>
				<div className="modal-header">
					<h2>System Error Logs</h2>
					<button onClick={onClose} className="modal-close-button">&times;</button>
				</div>
				
				{isLoading ? (
					<p className="empty-state-message">Loading error history...</p>
				) : errorLogs.length === 0 ? (
					<p className="empty-state-message">No errors logged recently. System is healthy.</p>
				) : (
					<div className="error-table-container">
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
									<tr key={logItem._id} className="error-table-row">
										<td className="error-timestamp">{new Date(logItem.timestamp).toLocaleString()}</td>
										<td>{logItem.source}</td>
										<td className="error-message-cell">
											<span className="error-message-text">{logItem.message}</span>
											{logItem.details && (
												<pre className="error-details-pre">{logItem.details}</pre>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default ErrorLogModal;
