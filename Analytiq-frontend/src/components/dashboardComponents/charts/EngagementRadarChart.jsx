import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * Normalize different metrics to 0-100 scale for fair radar comparison
 */
const normalizeValue = (value, type) => {
  if (!value && value !== 0) return 0;

  switch (type) {
    case 'scroll_depth':
      // Already 0-100 percentage
      return Math.min(100, Math.max(0, value));

    case 'clicks':
      // Normalize: 50 clicks = 100, scale linearly
      return Math.min(100, (value / 50) * 100);

    case 'idle_time':
      // Invert: less idle time is better
      // 0 seconds = 100, 300 seconds = 0
      return Math.max(0, 100 - (value / 300) * 100);

    case 'forms':
      // Normalize: 10 interactions = 100
      return Math.min(100, (value / 10) * 100);

    case 'video':
      // Normalize: 600 seconds (10 min) = 100
      return Math.min(100, (value / 600) * 100);

    default:
      return value;
  }
};

/**
 * Format actual values for tooltip display
 */
const formatValue = (value, type) => {
  if (!value && value !== 0) return 'N/A';

  switch (type) {
    case 'scroll_depth':
      return `${value.toFixed(1)}%`;
    case 'clicks':
      return `${value.toFixed(1)} clicks`;
    case 'idle_time':
      return `${value.toFixed(0)}s`;
    case 'forms':
      return `${value.toFixed(1)} interactions`;
    case 'video':
      return `${value.toFixed(0)}s`;
    default:
      return value;
  }
};

/**
 * EngagementRadarChart
 * @param {Object} data - engagement_summary object
 */
const EngagementRadarChart = ({ data }) => {
  // Empty state
  if (!data) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          padding: THEME_CONFIG.SPACING.xl,
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <AlertCircle
          size={48}
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            marginBottom: THEME_CONFIG.SPACING.md
          }}
        />
        <p
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
          }}
        >
          No engagement data available
        </p>
      </div>
    );
  }

  // Prepare normalized data with original values stored
  const metrics = [
    {
      metric: 'Scroll Depth',
      normalizedValue: normalizeValue(data.avg_scroll_depth_percent, 'scroll_depth'),
      actualValue: data.avg_scroll_depth_percent || 0,
      type: 'scroll_depth'
    },
    {
      metric: 'Clicks/Session',
      normalizedValue: normalizeValue(data.avg_clicks_per_session, 'clicks'),
      actualValue: data.avg_clicks_per_session || 0,
      type: 'clicks'
    },
    {
      metric: 'Engagement',
      normalizedValue: normalizeValue(data.avg_idle_time_sec, 'idle_time'),
      actualValue: data.avg_idle_time_sec || 0,
      type: 'idle_time'
    },
    {
      metric: 'Form Actions',
      normalizedValue: normalizeValue(data.avg_form_interactions, 'forms'),
      actualValue: data.avg_form_interactions || 0,
      type: 'forms'
    },
    {
      metric: 'Video Watch',
      normalizedValue: normalizeValue(data.avg_video_watch_time_sec, 'video'),
      actualValue: data.avg_video_watch_time_sec || 0,
      type: 'video'
    }
  ];

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease',
        minHeight: '400px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}33, 0 4px 30px ${darkerElectricBlue}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: THEME_CONFIG.SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
          <Target
            size={24}
            style={{
              color: darkElectricBlue,
              filter: `drop-shadow(0 0 8px ${darkElectricBlue})`
            }}
          />
          <h3
            className="dash-card-title"
            style={{
              color: THEME_CONFIG.COLORS.textPrimary,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h3,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.secondary,
              margin: 0
            }}
          >
            Engagement Metrics
          </h3>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={metrics}
        >
          <PolarGrid
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            strokeOpacity={0.4}
          />

          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: THEME_CONFIG.COLORS.textSecondary,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              fontWeight: 500
            }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 10
            }}
            tickCount={6}
          />

          <Radar
            dataKey="normalizedValue"
            stroke={darkElectricBlue}
            fill={darkElectricBlue}
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: darkElectricBlue,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
            activeDot={{
              r: 6,
              fill: darkElectricBlue,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
          />

          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            contentStyle={{
              backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
              border: `2px solid ${darkElectricBlue}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              color: THEME_CONFIG.COLORS.textPrimary,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              padding: THEME_CONFIG.SPACING.sm,
              boxShadow: `0 0 15px ${darkElectricBlue}33`
            }}
            itemStyle={{
              color: THEME_CONFIG.COLORS.textPrimary
            }}
            labelStyle={{
              color: THEME_CONFIG.COLORS.textPrimary,
              fontWeight: 600,
              marginBottom: '4px'
            }}
            formatter={(value, name, props) => {
              const metric = props.payload;
              return [
                formatValue(metric.actualValue, metric.type),
                'Value'
              ];
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementRadarChart;
