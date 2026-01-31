/**
 * MetricCard.jsx - KPI Display Card Component
 * Displays key metrics with large numbers, trend indicators, and sparklines
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  sparklineData = [], 
  format = 'number',
  loading = false 
}) => {
  if (loading) {
    return (
      <div 
        className="border-2 rounded-sm p-6 animate-pulse"
        style={{
          borderColor: THEME_CONFIG.COLORS.text + '40',
          backgroundColor: THEME_CONFIG.COLORS.context + '20'
        }}
      >
        <div 
          className="h-4 rounded mb-3"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-8 rounded mb-2"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-3 rounded w-16"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
      </div>
    );
  }

  const formatValue = (val) => {
    if (format === 'percentage') return `${val}%`;
    if (format === 'duration') return `${Math.floor(val / 60)}m ${val % 60}s`;
    if (format === 'number') return val?.toLocaleString() || '0';
    return val;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#10B981'; // Green
    if (trend === 'down') return '#EF4444'; // Red
    return THEME_CONFIG.COLORS.text;
  };

  return (
    <div 
      className="border-2 rounded-sm p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Title */}
      <h3 
        className="text-sm font-medium mb-2"
        style={{ color: THEME_CONFIG.COLORS.text + 'CC' }}
      >
        {title}
      </h3>

      {/* Main Value */}
      <div 
        className="text-3xl font-bold mb-2"
        style={{ color: THEME_CONFIG.COLORS.text }}
      >
        {formatValue(value)}
      </div>

      {/* Change Indicator */}
      {change && (
        <div 
          className="text-sm font-medium flex items-center"
          style={{ color: getTrendColor() }}
        >
          <span className="mr-1">
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
          {change}
        </div>
      )}

      {/* Sparkline Placeholder - Will be implemented with ECharts */}
      {sparklineData.length > 0 && (
        <div className="mt-4 h-12">
          {/* TODO: Implement mini sparkline chart */}
          <div 
            className="text-xs"
            style={{ color: THEME_CONFIG.COLORS.text + '80' }}
          >
            Sparkline: {sparklineData.length} data points
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;