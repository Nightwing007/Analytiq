import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

// Electric blue gradient palette for event types
const EVENT_COLORS = {
  pageview: '#0066FF',  // Primary electric blue
  click: '#4D94FF',     // Lighter blue
  exit: '#1A75FF',      // Medium blue
};

// Prepare chart data: group by timestamp, count event types
function prepareTimelineData(data) {
  if (!Array.isArray(data)) return [];

  const grouped = {};
  data.forEach((event) => {
    const ts = event.timestamp.slice(0, 13); // hour granularity
    if (!grouped[ts]) grouped[ts] = { timestamp: ts, pageview: 0, click: 0, exit: 0 };
    if (event.event_type === 'pageview') grouped[ts].pageview += 1;
    if (event.event_type === 'click') grouped[ts].click += 1;
    if (event.event_type === 'exit') grouped[ts].exit += 1;
  });

  return Object.values(grouped).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

const EventTimelineChart = ({ data }) => {
  const chartData = prepareTimelineData(data);

  // Empty state
  if (!chartData.length) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          padding: THEME_CONFIG.SPACING.xl,
          minHeight: '350px',
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
          No event timeline data available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease'
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: THEME_CONFIG.SPACING.sm,
          marginBottom: THEME_CONFIG.SPACING.lg
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            backgroundColor: `${darkElectricBlue}15`
          }}
        >
          <Activity size={18} style={{ color: darkElectricBlue }} />
        </div>
        <h3
          className="card-title"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h5,
            fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
            color: THEME_CONFIG.COLORS.textPrimary,
            letterSpacing: '0.5px',
            margin: 0
          }}
        >
          Event Timeline
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="timestamp"
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 11
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            tickFormatter={(value) => {
              // Format timestamp to readable format
              try {
                const date = new Date(value);
                return date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
              } catch {
                return value;
              }
            }}
          />

          <YAxis
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 11
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            allowDecimals={false}
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
            cursor={{ fill: 'transparent' }}
            itemStyle={{
              color: THEME_CONFIG.COLORS.textPrimary
            }}
            labelStyle={{
              color: THEME_CONFIG.COLORS.textPrimary,
              fontWeight: 600,
              marginBottom: '4px'
            }}
            labelFormatter={(value) => {
              try {
                const date = new Date(value);
                return date.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              } catch {
                return value;
              }
            }}
          />

          <Legend
            wrapperStyle={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              color: THEME_CONFIG.COLORS.textSecondary,
              paddingTop: THEME_CONFIG.SPACING.md
            }}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: THEME_CONFIG.COLORS.textSecondary }}>
                {value}
              </span>
            )}
          />

          <Line
            type="monotone"
            dataKey="pageview"
            stroke={EVENT_COLORS.pageview}
            strokeWidth={3}
            dot={false}
            name="Pageviews"
            activeDot={{
              r: 5,
              fill: EVENT_COLORS.pageview,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
            animationDuration={1000}
          />

          <Line
            type="monotone"
            dataKey="click"
            stroke={EVENT_COLORS.click}
            strokeWidth={3}
            dot={false}
            name="Clicks"
            activeDot={{
              r: 5,
              fill: EVENT_COLORS.click,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
            animationDuration={1000}
          />

          <Line
            type="monotone"
            dataKey="exit"
            stroke={EVENT_COLORS.exit}
            strokeWidth={3}
            dot={false}
            name="Exits"
            activeDot={{
              r: 5,
              fill: EVENT_COLORS.exit,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer Info */}
      <div
        style={{
          marginTop: THEME_CONFIG.SPACING.md,
          paddingTop: THEME_CONFIG.SPACING.md,
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textMuted,
          fontFamily: "'Rajdhani', sans-serif",
          textAlign: 'center'
        }}
      >
        Showing {chartData.length} data points • Hourly event counts
      </div>
    </div>
  );
};

export default EventTimelineChart;
