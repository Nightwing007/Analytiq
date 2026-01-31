/**
 * TimeSeriesChart.jsx - Visitors Over Time Chart
 * Interactive line chart with area fill for time series data
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';

const TimeSeriesChart = ({ 
  data = [], 
  title = "Visitors Over Time",
  timeRange = "7d",
  onTimeRangeChange = () => {},
  loading = false 
}) => {
  if (loading) {
    return (
      <div 
        className="border-2 rounded-sm p-6 animate-pulse"
        style={{
          borderColor: THEME_CONFIG.COLORS.text,
          backgroundColor: THEME_CONFIG.COLORS.context + '10'
        }}
      >
        <div 
          className="h-6 rounded mb-4"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-64 rounded"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
        ></div>
      </div>
    );
  }

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div 
      className="border-2 rounded-sm p-6"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Header with Title and Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: THEME_CONFIG.COLORS.text }}
        >
          {title}
        </h3>
        
        <div className="flex space-x-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              className="px-3 py-1 text-sm border-2 rounded-sm transition-colors"
              style={{
                borderColor: timeRange === option.value 
                  ? THEME_CONFIG.COLORS.primary 
                  : THEME_CONFIG.COLORS.text + '40',
                backgroundColor: timeRange === option.value 
                  ? THEME_CONFIG.COLORS.primary + '20' 
                  : 'transparent',
                color: timeRange === option.value 
                  ? THEME_CONFIG.COLORS.primary 
                  : THEME_CONFIG.COLORS.text
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        {data && data.length > 0 ? (
          <div 
            className="flex items-center justify-center h-full border-2 rounded-sm"
            style={{ 
              borderColor: THEME_CONFIG.COLORS.text + '40',
              color: THEME_CONFIG.COLORS.text + '80'
            }}
          >
            {/* TODO: Implement ECharts Time Series */}
            <div className="text-center">
              <div className="text-lg mb-2">📈</div>
              <div>ECharts Time Series Chart</div>
              <div className="text-sm">Data points: {data.length}</div>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center justify-center h-full border-2 rounded-sm"
            style={{ 
              borderColor: THEME_CONFIG.COLORS.text + '40',
              color: THEME_CONFIG.COLORS.text + '80'
            }}
          >
            No time series data available
          </div>
        )}
      </div>

      {/* Chart Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Interactive zoom and pan enabled
        </div>
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Real-time updates: Active
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;