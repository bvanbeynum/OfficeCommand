// /home/bvanbeynum/dev/officecommand/frontend/App.js

import React, { useState } from 'react';
import AuthModal from './components/AuthModal';
import { SensorProvider } from './context/SensorContext';

// Placeholder for the main dashboard content
const AuthenticatedDashboard = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'white', backgroundColor: '#282c34', minHeight: '100vh' }}>
            <h1>Welcome to the Office Command Dashboard!</h1>
            <p>Content will appear here once implemented.</p>
            {/* SensorContext data will be consumed by child components here */}
        </div>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuthentication = (status) => {
        setIsAuthenticated(status);
    };

    return (
        <div className="app-container">
            {isAuthenticated ? (<SensorProvider isAuthenticated={isAuthenticated}><AuthenticatedDashboard /></SensorProvider>) : (<AuthModal onAuthenticate={handleAuthentication} />)}
        </div>
    );
};

export default App;
