// /home/bvanbeynum/dev/officecommand/frontend/components/AuthModal.js

import React, { useState } from 'react';

const AuthModal = ({ onAuthenticate }) => {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		
		try {
			const response = await fetch('/api/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});
			const result = await response.json();
			
			if (result.success && result.data) {
				onAuthenticate(true);
			} else {
				setError('Incorrect password. Please try again.');
				onAuthenticate(false);
			}
		} catch (fetchError) {
			setError('Network error during authentication.');
			onAuthenticate(false);
		} finally {
			setPassword('');
		}
	};

	return (
		<div className="auth-modal-overlay">
			<div className="auth-modal-content">
				<h2 style={{ marginBottom: '24px' }}>Office Command</h2>
				<form onSubmit={handleSubmit}>
					<input 
						className="auth-input"
						type="password" 
						value={password} 
						onChange={(event) => setPassword(event.target.value)} 
						placeholder="Password" 
						required 
					/>
					<button className="auth-btn" type="submit">Unlock Dashboard</button>
					{error && <p className="error-message">{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default AuthModal;
