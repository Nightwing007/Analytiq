/**
 * EngagementRadar.jsx - User Engagement Metrics Radar Chart
 * Multi-dimensional view of user engagement metrics
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { Activity, MousePointer, Scroll, Play, FileText } from 'lucide-react';

const EngagementRadar = ({ 
  engagementData = {},
  title = "User Engagement",
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
          className="h-48 rounded"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
        ></div>
      </div>
    );
  }

  const engagementMetrics = [
    {
      key: 'avg_scroll_depth_percent',
      name: 'Scroll Depth',
      icon: <Scroll size={16} />,
      max: 100,
      unit: '%',
      description: 'How far users scroll on pages'
    },
    {
      key: 'avg_clicks_per_session',
      name: 'Clicks/Session',
      icon: <MousePointer size={16} />,
      max: 20,
      unit: 'clicks',
      description: 'Average clicks per user session'
    },
    {
      key: 'avg_form_interactions',
      name: 'Form Interactions',
      icon: <FileText size={16} />,
      max: 10,
      unit: 'interactions',
      description: 'Forms filled or interacted with'
    },
    {
      key: 'avg_video_watch_time_sec',
      name: 'Video Watch Time',
      icon: <Play size={16} />,
      max: 300,
      unit: 'seconds',
      description: 'Average time spent watching videos'
    },
    {
      key: 'avg_idle_time_sec',
      name: 'Idle Time',
      icon: <Activity size={16} />,
      max: 60,
      unit: 'seconds',
      description: 'Time spent inactive (lower is better)'
    }
  ];

  const getEngagementScore = (value, max) => {
    return Math.min((value / max) * 100, 100);
  };

  const getEngagementLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#10B981' };
    if (score >= 60) return { level: 'Good', color: '#F59E0B' };
    if (score >= 40) return { level: 'Average', color: '#6B7280' };
    return { level: 'Needs Improvement', color: '#EF4444' };
  };

  const overallScore = engagementMetrics.reduce((acc, metric) => {
    const value = engagementData[metric.key] || 0;
    return acc + getEngagementScore(value, metric.max);
  }, 0) / engagementMetrics.length;

  const { level, color } = getEngagementLevel(overallScore);

  return (
    <div 
      className="border-2 rounded-sm p-6"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: THEME_CONFIG.COLORS.text }}
        >
          {title}
        </h3>
        
        <div className="text-right">
          <div 
            className="text-2xl font-bold"
            style={{ color }}
          >
            {overallScore.toFixed(0)}
          </div>
          <div 
            className="text-xs"
            style={{ color: THEME_CONFIG.COLORS.text + '80' }}
          >
            Overall Score
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Radar Chart Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Radar Chart Visual */}
            <div 
              className="w-40 h-40 rounded-full border-2 flex items-center justify-center relative"
              style={{ borderColor: THEME_CONFIG.COLORS.text + '40' }}
            >
              {/* Inner Rings */}
              <div 
                className="w-32 h-32 rounded-full border absolute"
                style={{ borderColor: THEME_CONFIG.COLORS.text + '20' }}
              ></div>
              <div 
                className="w-24 h-24 rounded-full border absolute"
                style={{ borderColor: THEME_CONFIG.COLORS.text + '20' }}
              ></div>
              <div 
                className="w-16 h-16 rounded-full border absolute"
                style={{ borderColor: THEME_CONFIG.COLORS.text + '20' }}
              ></div>

              {/* Center Content */}
              <div className="text-center z-10">
                <div 
                  className="text-sm font-bold"
                  style={{ color }}
                >
                  {level}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                >
                  ECharts Radar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="w-1/2 ml-6">
          <h4 
            className="text-sm font-medium mb-4"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            Engagement Metrics
          </h4>
          
          <div className="space-y-3">
            {engagementMetrics.map((metric) => {
              const value = engagementData[metric.key] || 0;
              const score = getEngagementScore(value, metric.max);
              const metricLevel = getEngagementLevel(score);

              return (
                <div 
                  key={metric.key}
                  className="p-3 rounded-sm"
                  style={{
                    backgroundColor: THEME_CONFIG.COLORS.background + '40',
                    borderLeft: `4px solid ${metricLevel.color}`
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div style={{ color: metricLevel.color }}>
                        {metric.icon}
                      </div>
                      <span 
                        className="text-sm font-medium ml-2"
                        style={{ color: THEME_CONFIG.COLORS.text }}
                      >
                        {metric.name}
                      </span>
                    </div>
                    <div 
                      className="text-sm font-bold"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {metric.unit === 'seconds' ? `${Math.round(value)}s` : 
                       metric.unit === '%' ? `${value.toFixed(1)}%` : 
                       `${value.toFixed(1)} ${metric.unit}`}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div 
                    className="h-2 rounded-full mt-2"
                    style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: metricLevel.color,
                        width: `${score}%`
                      }}
                    ></div>
                  </div>
                  
                  <div 
                    className="text-xs mt-1"
                    style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                  >
                    {metric.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: THEME_CONFIG.COLORS.text + '40' }}>
        <div className="text-sm" style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          <strong>Engagement Insight:</strong> {
            overallScore >= 80 ? 'Users are highly engaged with your content!' :
            overallScore >= 60 ? 'Good engagement levels, room for improvement in some areas.' :
            overallScore >= 40 ? 'Average engagement, consider optimizing user experience.' :
            'Low engagement detected, focus on improving content and UX.'
          }
        </div>
      </div>
    </div>
  );
};

export default EngagementRadar;