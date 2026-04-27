// /home/bvanbeynum/dev/officecommand/frontend/components/TemperatureChart.js

import React, { useRef, useState, useLayoutEffect } from 'react';

const TemperatureChart = ({ data, timeframe, lightThreshold = 150 }) => {
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

    const validData = (data || [])
        .filter(d => d && typeof d.temperature === 'number' && typeof d.humidity === 'number' && d.timestamp)
        .map(d => ({
            temperature: d.temperature,
            humidity: d.humidity,
            light: d.light || 0,
            timestamp: new Date(d.timestamp).getTime()
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    if (validData.length < 2 || chartWidth === 0 || chartHeight === 0) {
        return <div ref={containerRef} style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No historical data</div>;
    }

    // Temperature scaling
    const temps = validData.map(d => d.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const minTempIdx = temps.indexOf(minTemp);
    const maxTempIdx = temps.lastIndexOf(maxTemp);
    const tempPadding = (maxTemp - minTemp) * 0.2 || 2;
    const displayMinTemp = minTemp - tempPadding;
    const displayMaxTemp = maxTemp + tempPadding;
    const tempRange = displayMaxTemp - displayMinTemp;

    // Humidity scaling (fixed 0-100% or dynamic)
    const hums = validData.map(d => d.humidity);
    const minHum = Math.min(...hums);
    const maxHum = Math.max(...hums);
    const minHumIdx = hums.indexOf(minHum);
    const maxHumIdx = hums.lastIndexOf(maxHum);
    const displayMinHum = 0;
    const displayMaxHum = 100;
    const humRange = 100;

    const minTimestamp = Math.min(...validData.map(d => d.timestamp));
    const maxTimestamp = Math.max(...validData.map(d => d.timestamp));
    const timeRange = maxTimestamp - minTimestamp;

    const margin = { top: 20, right: 35, bottom: 20, left: 35 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const getX = (ts) => margin.left + ((ts - minTimestamp) / timeRange) * innerWidth;

    const tempPoints = validData.map(d => {
        const x = getX(d.timestamp);
        const y = margin.top + innerHeight - ((d.temperature - displayMinTemp) / tempRange) * innerHeight;
        return { x, y };
    });

    const humPoints = validData.map(d => {
        const x = getX(d.timestamp);
        const y = margin.top + innerHeight - ((d.humidity - displayMinHum) / humRange) * innerHeight;
        return { x, y };
    });

    // Calculate light-on regions
    const lightRegions = [];
    let currentRegion = null;

    validData.forEach((d, i) => {
        const isOn = d.light >= lightThreshold;
        if (isOn) {
            if (!currentRegion) {
                currentRegion = { start: d.timestamp, end: d.timestamp };
            } else {
                currentRegion.end = d.timestamp;
            }
        } else {
            if (currentRegion) {
                lightRegions.push(currentRegion);
                currentRegion = null;
            }
        }
    });
    if (currentRegion) lightRegions.push(currentRegion);

    const tempLinePath = tempPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const tempAreaPath = `${tempLinePath} L ${tempPoints[tempPoints.length-1].x} ${margin.top + innerHeight} L ${tempPoints[0].x} ${margin.top + innerHeight} Z`;

    const humLinePath = humPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const Marker = ({ point, value, color, unit, isMax }) => (
        <g>
            <line x1={point.x} y1={point.y - 4} x2={point.x} y2={point.y + 4} stroke={color} strokeWidth="2" />
            <circle cx={point.x} cy={point.y} r="3" fill="var(--color-background-card)" stroke={color} strokeWidth="1.5" />
            <text 
                x={point.x} 
                y={point.y + (isMax ? -10 : 16)} 
                textAnchor="middle" 
                fill={color} 
                fontSize="9" 
                fontWeight="700"
                style={{ filter: 'drop-shadow(0px 0px 2px var(--color-background-card))' }}
            >
                {value.toFixed(1)}{unit}
            </text>
        </g>
    );

    return (
        <div ref={containerRef} style={{ height: '140px', width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, right: 0, display: 'flex', gap: '12px', fontSize: '10px', fontWeight: '600' }}>
                <span style={{ color: 'var(--color-accent-yellow)' }}>■ LIGHTS ON</span>
                <span style={{ color: 'var(--color-accent-blue)' }}>● TEMP</span>
                <span style={{ color: 'var(--color-accent-green)' }}>● HUMIDITY</span>
            </div>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Light regions background */}
                {lightRegions.map((region, i) => (
                    <rect 
                        key={i}
                        x={getX(region.start)}
                        y={margin.top}
                        width={Math.max(2, getX(region.end) - getX(region.start))}
                        height={innerHeight}
                        fill="var(--color-accent-yellow)"
                        fillOpacity="0.1"
                    />
                ))}
                
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

                <path d={tempAreaPath} fill="url(#tempGradient)" />
                <path d={tempLinePath} fill="none" stroke="var(--color-accent-blue)" strokeWidth="2" />
                <path d={humLinePath} fill="none" stroke="var(--color-accent-green)" strokeWidth="1.5" strokeDasharray="3,2" />

                {/* Min/Max Markers */}
                <Marker point={tempPoints[minTempIdx]} value={minTemp} color="var(--color-accent-blue)" unit="°" isMax={false} />
                <Marker point={tempPoints[maxTempIdx]} value={maxTemp} color="var(--color-accent-blue)" unit="°" isMax={true} />
                <Marker point={humPoints[minHumIdx]} value={minHum} color="var(--color-accent-green)" unit="%" isMax={false} />
                <Marker point={humPoints[maxHumIdx]} value={maxHum} color="var(--color-accent-green)" unit="%" isMax={true} />

                {/* Left Axis - Temperature */}
                <text x={margin.left - 8} y={margin.top} textAnchor="end" dominantBaseline="middle" fill="var(--color-accent-blue)" fontSize="10">{displayMaxTemp.toFixed(0)}°</text>
                <text x={margin.left - 8} y={margin.top + innerHeight} textAnchor="end" dominantBaseline="middle" fill="var(--color-accent-blue)" fontSize="10">{displayMinTemp.toFixed(0)}°</text>

                {/* Right Axis - Humidity */}
                <text x={chartWidth - margin.right + 8} y={margin.top} textAnchor="start" dominantBaseline="middle" fill="var(--color-accent-green)" fontSize="10">100%</text>
                <text x={chartWidth - margin.right + 8} y={margin.top + innerHeight} textAnchor="start" dominantBaseline="middle" fill="var(--color-accent-green)" fontSize="10">0%</text>

                {/* Bottom Axis - Time (Dynamic based on timeframe) */}
                <text x={margin.left} y={chartHeight - 4} textAnchor="start" fill="var(--color-text-muted)" fontSize="10">
                    {timeframe === '1h' ? '60m ago' : timeframe === '5h' ? '5h ago' : '24h ago'}
                </text>
                <text x={margin.left + innerWidth * 0.5} y={chartHeight - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">
                    {timeframe === '1h' ? '30m ago' : timeframe === '5h' ? '2.5h ago' : '12h ago'}
                </text>
                <text x={margin.left + innerWidth} y={chartHeight - 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="10">Now</text>
            </svg>
        </div>
    );
};

export default TemperatureChart;
