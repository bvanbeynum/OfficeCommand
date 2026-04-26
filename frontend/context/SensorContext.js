// /home/bvanbeynum/dev/officecommand/frontend/context/SensorContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchCurrentSensors, fetchSettings } from '../utils/api'; // Import the API functions

// 1. Create the Context
const SensorContext = createContext(null);

// 2. Create a custom hook for easy consumption
export const useSensor = () => {
    const context = useContext(SensorContext);
    if (context === undefined) {
        throw new Error('useSensor must be used within a SensorProvider');
    }
    return context;
};

// 3. Create the Provider Component
export const SensorProvider = ({ children, isAuthenticated }) => {
    // State for current sensor telemetry
    const [currentTelemetry, setCurrentTelemetry] = useState(null);
    // State for settings (e.g., light threshold)
    const [settings, setSettings] = useState({ lightThreshold: 500 }); // Default or initial value
    // State for historical sensor data (arrays for charting)
    const [historicalData, setHistoricalData] = useState({
        temperature: [],
        humidity: [],
        light: [],
        doorOpen: []
    }); // Placeholder for future use

    // 3.4 Implement a useEffect polling mechanism inside context to call fetchCurrentSensors() every 10 seconds (only if authenticated).
    useEffect(() => {
        let intervalId;

        const loadInitialSettings = async () => {
            const result = await fetchSettings();
            if (result.success) {
                setSettings(result.data);
            } else {
                console.error("Failed to fetch initial settings:", result.error);
            }
        };

        const pollSensors = async () => {
            const result = await fetchCurrentSensors();

            if (result.success) {
                setCurrentTelemetry(result.data);
            } else {
                console.error("Failed to fetch current sensors:", result.error);
                // Optionally, handle error state or retry logic
            }
        };

        if (isAuthenticated) {
            loadInitialSettings(); // Fetch settings once on authentication
            pollSensors();
            // Then set up polling every 10 seconds
            intervalId = setInterval(pollSensors, 10000); // 10 seconds
        }

        // Cleanup function to clear the interval when component unmounts or isAuthenticated changes
        return () => { if (intervalId) { clearInterval(intervalId); } };
    }, [isAuthenticated]); // Re-run effect when isAuthenticated changes

    const contextValue = {
        currentTelemetry, setCurrentTelemetry,
        settings, setSettings,
        historicalData, setHistoricalData,
    };

    return <SensorContext.Provider value={contextValue}>{children}</SensorContext.Provider>;
};
