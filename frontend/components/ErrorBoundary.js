import React from 'react';
import { postError } from '../utils/api';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		
		// Post the error string and component stack trace to the API
		postError({
			source: 'frontend_boundary',
			message: error.toString(),
			details: errorInfo.componentStack || error.stack
		}).catch(postException => {
			console.error("Failed to POST error log:", postException);
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-primary)' }}>
					<h2 style={{ color: '#ff4444' }}>UI Rendering Error</h2>
					<p>An unexpected error occurred in the dashboard interface. The details have been logged to the server.</p>
					<button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px' }}>Reload Dashboard</button>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
