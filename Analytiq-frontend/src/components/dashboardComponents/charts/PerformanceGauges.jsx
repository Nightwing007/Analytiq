/**
 * PerformanceGauges.jsx - Core Web Vitals Performance Metrics
 * Gauge charts for FCP, LCP, CLS, FID with color-coded indicators
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { Gauge, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PerformanceGauges = ({ 
  performanceMetrics = {},
  title = "Core Web Vitals",
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
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i}
              className="h-32 rounded"
              style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      key: 'first_contentful_paint_avg_ms',
      name: 'First Contentful Paint',
      unit: 'ms',
      thresholds: { good: 1800, needsImprovement: 3000 },
      description: 'Time until first content appears'
    },
    {
      key: 'largest_contentful_paint_avg_ms',
      name: 'Largest Contentful Paint',
      unit: 'ms',
      thresholds: { good: 2500, needsImprovement: 4000 },
      description: 'Time until largest content loads'
    },
    {
      key: 'cumulative_layout_shift_avg',
      name: 'Cumulative Layout Shift',
      unit: '',
      thresholds: { good: 0.1, needsImprovement: 0.25 },
      description: 'Visual stability score'
    },
    {
      key: 'first_input_delay_avg_ms',
      name: 'First Input Delay',
      unit: 'ms',
      thresholds: { good: 100, needsImprovement: 300 },
      description: 'Responsiveness to user input'
    }
  ];

  const getPerformanceStatus = (value, thresholds) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10B981';
      case 'needs-improvement': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return THEME_CONFIG.COLORS.text;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle size={16} />;
      case 'needs-improvement': return <AlertTriangle size={16} />;
      case 'poor': return <AlertTriangle size={16} />;
      default: return <Gauge size={16} />;
    }
  };

  return (
    <div 
      className="border-2 rounded-sm p-6"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <Gauge size={20} style={{ color: THEME_CONFIG.COLORS.primary }} />
        <h3 
          className="text-lg font-semibold ml-2"
          style={{ color: THEME_CONFIG.COLORS.text }}
        >
          {title}
        </h3>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map(metric => {
          const value = performanceMetrics[metric.key] || 0;
          const status = getPerformanceStatus(value, metric.thresholds);
          const statusColor = getStatusColor(status);

          return (
            <div 
              key={metric.key}
              className="border-2 rounded-sm p-4"
              style={{
                borderColor: THEME_CONFIG.COLORS.text + '40',
                backgroundColor: THEME_CONFIG.COLORS.background + '40'
              }}
            >
              {/* Metric Header */}
              <div className="flex items-center justify-between mb-3">
                <h4 
                  className="text-sm font-medium"
                  style={{ color: THEME_CONFIG.COLORS.text }}
                >
                  {metric.name}
                </h4>
                <div 
                  className="flex items-center"
                  style={{ color: statusColor }}
                >
                  {getStatusIcon(status)}
                </div>
              </div>

              {/* Gauge Placeholder */}
              <div className="flex items-center justify-center h-24 mb-3">
                <div 
                  className="border-4 rounded-full w-20 h-20 flex items-center justify-center"
                  style={{ borderColor: statusColor + '40' }}
                >
                  <div className="text-center">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {metric.unit === 'ms' ? Math.round(value) : value.toFixed(2)}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                    >
                      {metric.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Description */}
              <div className="text-center">
                <div 
                  className="text-sm font-medium capitalize mb-1"
                  style={{ color: statusColor }}
                >
                  {status.replace('-', ' ')}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                >
                  {metric.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Performance Metrics */}
      <div className="mt-6 pt-6 border-t-2" style={{ borderColor: THEME_CONFIG.COLORS.text + '40' }}>
        <h4 
          className="text-sm font-medium mb-4"
          style={{ color: THEME_CONFIG.COLORS.text }}
        >
          Additional Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
              Server Response Time
            </span>
            <span style={{ color: THEME_CONFIG.COLORS.text }}>
              {performanceMetrics.server_response_time_avg_ms || 0}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
              CDN Cache Hit Ratio
            </span>
            <span style={{ color: THEME_CONFIG.COLORS.text }}>
              {performanceMetrics.cdn_cache_hit_ratio_percent || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGauges;