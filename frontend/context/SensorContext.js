// /home/bvanbeynum/dev/officecommand/frontend/context/SensorContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchCurrentSensors, fetchSettings, fetchHistory } from '../utils/api'; // Import the API functions, including fetchHistory

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

// 3. Create the Provider Component.
// This provider manages global state for sensor telemetry, settings, and historical data.
// It also implements polling for current data and fetches historical data based on user selection.
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
    });
    // State for the selected timeframe for historical data fetching
    const [selectedTimeframe, setSelectedTimeframe] = useState('1h'); // Default to '1h'

    // Effect for polling current sensor data and fetching initial settings.
    // This effect runs once on authentication status change to start/stop polling
    // and fetch initial settings.
    useEffect(() => {
        let intervalId;

        // Function to fetch initial settings from the backend
        const loadInitialSettings = async () => {
            const result = await fetchSettings();
            if (result.success) {
                setSettings(result.data);
            } else {
                console.error("Failed to fetch initial settings:", result.error);
            }
        };

        // Function to poll current sensor data
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
            loadInitialSettings(); // Fetch settings once when authenticated
            pollSensors();
            // Then set up polling every 10 seconds
            intervalId = setInterval(pollSensors, 10000); // 10 seconds
        }

        // Cleanup function to clear the interval when component unmounts or isAuthenticated changes
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isAuthenticated]); // Re-run this effect when isAuthenticated changes

    // Effect for fetching historical data when isAuthenticated or selectedTimeframe changes.
    // This ensures the chart data updates when the user changes the timeframe or authenticates.
    useEffect(() => {
        const loadHistoricalData = async () => {
            if (isAuthenticated && selectedTimeframe) {
                const result = await fetchHistory(selectedTimeframe);
                if (result.success) {
                    setHistoricalData(previousData => ({ ...previousData, temperature: result.data })); // Update only temperature history for now
                } else {
                    console.error("Failed to fetch historical data:", result.error);
                }
            }
        };
        loadHistoricalData();
    }, [isAuthenticated, selectedTimeframe]); // Re-run this effect when isAuthenticated or selectedTimeframe changes

    const contextValue = {
        currentTelemetry, setCurrentTelemetry,
        settings, setSettings,
        historicalData, setHistoricalData, // Expose historicalData
        selectedTimeframe, setSelectedTimeframe, // Expose selectedTimeframe and its setter
    };

    return <SensorContext.Provider value={contextValue}>{children}</SensorContext.Provider>;
};
