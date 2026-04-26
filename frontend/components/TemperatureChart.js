// /home/bvanbeynum/dev/officecommand/frontend/components/TemperatureChart.js

import React, { useRef, useEffect, useState } from 'react';
import { useSensor } from '../context/SensorContext';

// Component to draw a dynamic SVG line chart for historical temperature data
const TemperatureChart = () => {
    const { historicalData } = useSensor();
    const temperatures = historicalData.temperature;

    // State to store chart dimensions dynamically
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);
    const containerRef = useRef(null);

    // Update chart dimensions on mount and resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth);
                setChartHeight(containerRef.current.offsetHeight);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (!temperatures || temperatures.length === 0) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">Temperature History</h3>
                <div className="chart-container no-data">No historical temperature data available.</div>
            </div>
        );
    }

    // Determine min/max values for scaling
    const minTemp = Math.min(...temperatures.map(dataPoint => dataPoint.temperature));
    const maxTemp = Math.max(...temperatures.map(dataPoint => dataPoint.temperature));
    const tempRange = maxTemp - minTemp === 0 ? 1 : maxTemp - minTemp; // Avoid division by zero

    // Get min/max timestamps for x-axis scaling
    const minTimestamp = Math.min(...temperatures.map(dataPoint => new Date(dataPoint.timestamp).getTime()));
    const maxTimestamp = Math.max(...temperatures.map(dataPoint => new Date(dataPoint.timestamp).getTime()));
    const timeRange = maxTimestamp - minTimestamp === 0 ? 1 : maxTimestamp - minTimestamp; // Avoid division by zero

    // Margins for padding within the SVG
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    // Generate SVG path for the line chart
    const linePath = temperatures.map((dataPoint, index) => {
        const x = margin.left + ((new Date(dataPoint.timestamp).getTime() - minTimestamp) / timeRange) * innerWidth;
        const y = margin.top + innerHeight - ((dataPoint.temperature - minTemp) / tempRange) * innerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div ref={containerRef} className="chart-card">
            <h3 className="chart-title">Temperature History</h3>
            <div className="chart-container">
                <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
                    {/* X-axis */}
                    <line x1={margin.left} y1={margin.top + innerHeight} x2={margin.left + innerWidth} y2={margin.top + innerHeight} stroke="var(--color-text-secondary)" strokeWidth="1" />
                    {/* Y-axis */}
                    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerHeight} stroke="var(--color-text-secondary)" strokeWidth="1" />

                    {/* Line path */}
                    <path d={linePath} fill="none" stroke="var(--color-accent-blue)" strokeWidth="2" />

                    {/* Y-axis labels (example: min/max) */}
                    <text x={margin.left - 10} y={margin.top + innerHeight} textAnchor="end" dominantBaseline="middle" className="chart-label">{minTemp.toFixed(1)}°F</text>
                    <text x={margin.left - 10} y={margin.top} textAnchor="end" dominantBaseline="middle" className="chart-label">{maxTemp.toFixed(1)}°F</text>

                    {/* X-axis labels (example: start/end time) */}
                    <text x={margin.left} y={chartHeight - 5} textAnchor="start" dominantBaseline="hanging" className="chart-label">{new Date(minTimestamp).toLocaleTimeString()}</text>
                    <text x={chartWidth - margin.right} y={chartHeight - 5} textAnchor="end" dominantBaseline="hanging" className="chart-label">{new Date(maxTimestamp).toLocaleTimeString()}</text>
                </svg>
            </div>
        </div>
    );
};

export default TemperatureChart;
