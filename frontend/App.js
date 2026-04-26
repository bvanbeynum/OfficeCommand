// /home/bvanbeynum/dev/officecommand/frontend/App.js

import React, { useState } from 'react';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard'; // Import the new Dashboard component
import { SensorProvider } from './context/SensorContext';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false, requires auth

    const handleAuthentication = (status) => {
        setIsAuthenticated(status);
    };

    return (
        <div className="app-container"> {/* This container can hold global styling or alignment */}
            {isAuthenticated ? (<SensorProvider isAuthenticated={isAuthenticated}><Dashboard /></SensorProvider>) : (<AuthModal onAuthenticate={handleAuthentication} />)}
        </div>
    );
};

export default App;
