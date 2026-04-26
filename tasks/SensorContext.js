// /home/bvanbeynum/dev/officecommand/frontend/context/SensorContext.js

import React, { createContext, useState, useContext } from 'react';

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
export const SensorProvider = ({ children }) => {
    // State for current sensor telemetry
    const [currentTelemetry, setCurrentTelemetry] = useState(null);
    // State for settings (e.g., light threshold)
    const [settings, setSettings] = useState(null);
    // State for historical sensor data (arrays for charting)
    const [historicalData, setHistoricalData] = useState({
        temperature: [],
        humidity: [],
        light: [],
        doorOpen: []
    });

    const contextValue = {
        currentTelemetry, setCurrentTelemetry,
        settings, setSettings,
        historicalData, setHistoricalData,
    };

    return <SensorContext.Provider value={contextValue}>{children}</SensorContext.Provider>;
};
