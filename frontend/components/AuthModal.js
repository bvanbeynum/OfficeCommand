// /home/bvanbeynum/dev/officecommand/frontend/components/AuthModal.js

import React, { useState } from 'react';

// This component will be responsible for prompting the user for a password
// and handling the submission.
const AuthModal = ({ onAuthenticate }) => {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		setError(''); // Clear previous errors
		// In a real application, you would hash this password and compare it
		// with a stored hash, or send it to a backend for verification.
		// For now, a simple hardcoded check for demonstration.
		if (password === 'officecommand') { // Replace with actual secure password check
			onAuthenticate(true);
		} else {
			setError('Incorrect password. Please try again.');
			onAuthenticate(false);
		}
		setPassword(''); // Clear password field after attempt
	};

	return (
		<div className="auth-modal-overlay">
			<div className="auth-modal-content">
				<h2>Enter Password</h2>
				<form onSubmit={handleSubmit}>
					<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
					<button type="submit">Unlock Dashboard</button>
					{error && <p className="error-message">{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default AuthModal;
