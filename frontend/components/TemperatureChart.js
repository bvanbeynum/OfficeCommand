// /home/bvanbeynum/dev/officecommand/frontend/components/TemperatureChart.js

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'; // Use useLayoutEffect for DOM measurements

// Component to draw a dynamic SVG line chart for historical temperature data
const TemperatureChart = ({ historicalTemperatures }) => {
    const temperatures = historicalTemperatures;
    // State to store chart dimensions dynamically
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        console.log("TemperatureChart - historicalTemperatures prop updated:", historicalTemperatures);
    }, [historicalTemperatures]);

    // Update chart dimensions on mount and resize
    useLayoutEffect(() => { // Changed to useLayoutEffect
        const updateDimensions = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth);
                setChartHeight(containerRef.current.offsetHeight);
            }
        };

        updateDimensions();
        // Using a debounced resize listener for performance
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateDimensions, 100);
        };
        window.addEventListener('resize', handleResize); // Listen to debounced resize
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        // Only warn if dimensions remain zero after potential layout effects
        if (containerRef.current && (chartWidth === 0 || chartHeight === 0)) {
            console.warn("TemperatureChart: Dimensions are zero. Chart may not be visible.", { chartWidth, chartHeight });
        } else {
            console.log("TemperatureChart dimensions:", { chartWidth, chartHeight });
        }
    }, [chartWidth, chartHeight]);

    // Filter out invalid data points and extract relevant values
    const validTemperatures = temperatures
        .filter(dataPoint =>
            dataPoint &&
            typeof dataPoint.temperature === 'number' &&
            !isNaN(dataPoint.temperature) &&
            dataPoint.timestamp
        )
        .map(dataPoint => ({
            temperature: dataPoint.temperature,
            timestamp: new Date(dataPoint.timestamp).getTime()
        }));

    // Determine min/max values for scaling using only valid data
    const minTemp = Math.min(...validTemperatures.map(dataPoint => dataPoint.temperature));
    const maxTemp = Math.max(...validTemperatures.map(dataPoint => dataPoint.temperature));
    // Add a small buffer to min/max temp for better visual representation
    const tempPadding = (maxTemp - minTemp) * 0.1 || 1; // 10% padding or 1 degree if range is 0
    const displayMinTemp = minTemp - tempPadding;
    const displayMaxTemp = maxTemp + tempPadding;
    const tempRange = displayMaxTemp - displayMinTemp === 0 ? 1 : displayMaxTemp - displayMinTemp;

    console.log("Temperature data range:", { minTemp, maxTemp, displayMinTemp, displayMaxTemp, tempRange });

    // Get min/max timestamps for x-axis scaling
    const minTimestamp = Math.min(...validTemperatures.map(dataPoint => dataPoint.timestamp));
    const maxTimestamp = Math.max(...validTemperatures.map(dataPoint => dataPoint.timestamp));
    const timeRange = maxTimestamp - minTimestamp === 0 ? 1 : maxTimestamp - minTimestamp; // Avoid division by zero

    console.log("Timestamp range:", { minTimestamp: new Date(minTimestamp).toLocaleString(), maxTimestamp: new Date(maxTimestamp).toLocaleString(), timeRange });

    // Margins for padding within the SVG
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    // Ensure innerWidth and innerHeight are not negative
    const innerWidth = Math.max(0, chartWidth - margin.left - margin.right);
    const innerHeight = Math.max(0, chartHeight - margin.top - margin.bottom);

    console.log("Chart inner dimensions:", { innerWidth, innerHeight });

    // Generate SVG path for the line chart
    const linePath = validTemperatures.map((dataPoint, index) => {
        const x = margin.left + ((dataPoint.timestamp - minTimestamp) / timeRange) * innerWidth;
        const y = margin.top + innerHeight - ((dataPoint.temperature - displayMinTemp) / tempRange) * innerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    console.log("Generated SVG path:", linePath);

    return (
		<div className="chart-inner-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '250px' }}>
			<h3 className="chart-title">Temperature History</h3>
			<div ref={containerRef} className="chart-container" style={{ flexGrow: 1, position: 'relative' }}>
				{(validTemperatures.length < 2 || chartWidth === 0 || chartHeight === 0) ? (
					<div className="chart-container no-data">
						{chartWidth === 0 || chartHeight === 0 ? "Chart area not visible or zero dimensions." : "Not enough valid data points for a line chart (need at least 2)."}
					</div>
				) : (
					<svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
						{/* X-axis */}
						<line x1={margin.left} y1={margin.top + innerHeight} x2={margin.left + innerWidth} y2={margin.top + innerHeight} stroke="var(--color-text-secondary)" strokeWidth="1" />
						{/* Y-axis */}
						<line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerHeight} stroke="var(--color-text-secondary)" strokeWidth="1" />

						{/* Line path */}
						<path d={linePath} fill="none" stroke="var(--color-accent-blue)" strokeWidth="2" />

						{/* Y-axis labels (example: min/max) */}
						<text x={margin.left - 10} y={margin.top + innerHeight} textAnchor="end" dominantBaseline="middle" className="chart-label">{displayMinTemp.toFixed(1)}°F</text>
						<text x={margin.left - 10} y={margin.top} textAnchor="end" dominantBaseline="middle" className="chart-label">{displayMaxTemp.toFixed(1)}°F</text>

						{/* X-axis labels (example: start/end time) */}
						<text x={margin.left} y={margin.top + innerHeight + 10} textAnchor="start" dominantBaseline="hanging" className="chart-label">{new Date(minTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</text>
						<text x={chartWidth - margin.right} y={margin.top + innerHeight + 10} textAnchor="end" dominantBaseline="hanging" className="chart-label">{new Date(maxTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</text>
					</svg>
				)}
			</div>
		</div>
    );
};

export default TemperatureChart;
