/**
 * TrendCard.jsx - Cards with Trend Indicators
 * Enhanced metric cards with visual trend representations
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendCard = ({ 
  title, 
  value, 
  previousValue, 
  format = 'number',
  loading = false,
  subtitle = null
}) => {
  if (loading) {
    return (
      <div 
        className="border-2 rounded-sm p-4 animate-pulse"
        style={{
          borderColor: THEME_CONFIG.COLORS.text + '40',
          backgroundColor: THEME_CONFIG.COLORS.context + '20'
        }}
      >
        <div 
          className="h-3 rounded mb-2"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-6 rounded mb-2"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-3 rounded w-20"
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

  const calculateTrend = () => {
    if (!previousValue || previousValue === 0) return { trend: 'neutral', percentage: 0 };
    
    const change = ((value - previousValue) / previousValue) * 100;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return { trend, percentage: Math.abs(change).toFixed(1) };
  };

  const { trend, percentage } = calculateTrend();

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#10B981';
    if (trend === 'down') return '#EF4444';
    return THEME_CONFIG.COLORS.text + '80';
  };

  return (
    <div 
      className="border-2 rounded-sm p-4 transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Title */}
      <h4 
        className="text-xs font-medium mb-1"
        style={{ color: THEME_CONFIG.COLORS.text + 'CC' }}
      >
        {title}
      </h4>

      {/* Main Value */}
      <div 
        className="text-2xl font-bold mb-1"
        style={{ color: THEME_CONFIG.COLORS.text }}
      >
        {formatValue(value)}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div 
          className="text-xs mb-2"
          style={{ color: THEME_CONFIG.COLORS.text + '80' }}
        >
          {subtitle}
        </div>
      )}

      {/* Trend Indicator */}
      <div 
        className="flex items-center text-xs font-medium"
        style={{ color: getTrendColor() }}
      >
        {getTrendIcon()}
        <span className="ml-1">
          {percentage}% {trend === 'neutral' ? 'no change' : 'vs previous period'}
        </span>
      </div>
    </div>
  );
};

export default TrendCard;