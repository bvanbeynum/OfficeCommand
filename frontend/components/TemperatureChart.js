// /home/bvanbeynum/dev/officecommand/frontend/components/TemperatureChart.js

import React, { useRef, useState, useLayoutEffect } from 'react';

const TemperatureChart = ({ historicalTemperatures }) => {
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
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

    const validTemperatures = historicalTemperatures
        .filter(d => d && typeof d.temperature === 'number' && !isNaN(d.temperature) && d.timestamp)
        .map(d => ({
            temperature: d.temperature,
            timestamp: new Date(d.timestamp).getTime()
        }));

    if (validTemperatures.length < 2 || chartWidth === 0 || chartHeight === 0) {
        return <div ref={containerRef} style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No historical data</div>;
    }

    const minTemp = Math.min(...validTemperatures.map(d => d.temperature));
    const maxTemp = Math.max(...validTemperatures.map(d => d.temperature));
    const tempPadding = (maxTemp - minTemp) * 0.2 || 2;
    const displayMinTemp = minTemp - tempPadding;
    const displayMaxTemp = maxTemp + tempPadding;
    const tempRange = displayMaxTemp - displayMinTemp;

    const minTimestamp = Math.min(...validTemperatures.map(d => d.timestamp));
    const maxTimestamp = Math.max(...validTemperatures.map(d => d.timestamp));
    const timeRange = maxTimestamp - minTimestamp;

    const margin = { top: 10, right: 10, bottom: 20, left: 35 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const points = validTemperatures.map(d => {
        const x = margin.left + ((d.timestamp - minTimestamp) / timeRange) * innerWidth;
        const y = margin.top + innerHeight - ((d.temperature - displayMinTemp) / tempRange) * innerHeight;
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length-1].x} ${margin.top + innerHeight} L ${points[0].x} ${margin.top + innerHeight} Z`;

    return (
        <div ref={containerRef} style={{ height: '120px', width: '100%', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Horizontal grid lines */}
                {[0, 0.5, 1].map(v => (
                    <line 
                        key={v}
                        x1={margin.left} 
                        y1={margin.top + innerHeight * v} 
                        x2={margin.left + innerWidth} 
                        y2={margin.top + innerHeight * v} 
                        stroke="var(--color-border)" 
                        strokeWidth="1" 
                        strokeDasharray="4"
                    />
                ))}

                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke="var(--color-accent-blue)" strokeWidth="2" />

                <text x={margin.left - 8} y={margin.top} textAnchor="end" dominantBaseline="middle" fill="var(--color-text-muted)" fontSize="10">{displayMaxTemp.toFixed(0)}°F</text>
                <text x={margin.left - 8} y={margin.top + innerHeight} textAnchor="end" dominantBaseline="middle" fill="var(--color-text-muted)" fontSize="10">{displayMinTemp.toFixed(0)}°F</text>

                <text x={margin.left} y={chartHeight - 4} textAnchor="start" fill="var(--color-text-muted)" fontSize="10">06hr</text>
                <text x={margin.left + innerWidth * 0.25} y={chartHeight - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">08hr</text>
                <text x={margin.left + innerWidth * 0.5} y={chartHeight - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">10hr</text>
                <text x={margin.left + innerWidth * 0.75} y={chartHeight - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">16hr</text>
                <text x={margin.left + innerWidth} y={chartHeight - 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="10">24hr</text>
            </svg>
        </div>
    );
};

export default TemperatureChart;
