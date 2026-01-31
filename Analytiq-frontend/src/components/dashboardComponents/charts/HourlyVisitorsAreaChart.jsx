import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const GRADIENT_ID = 'hourlyVisitorsGradient';

/**
 * HourlyVisitorsAreaChart
 * @param {Object} data - Object of { hour: { hour, average_visitors, total_visitors }, ... }
 */
const HourlyVisitorsAreaChart = ({ data }) => {
  // Convert object to sorted array by hour
  const chartData = data && typeof data === 'object'
    ? Object.values(data).sort((a, b) => (a.hour > b.hour ? 1 : -1))
    : [];

  // Find peak hour
  const peakHour = chartData.length > 0
    ? chartData.reduce((max, curr) =>
      curr.average_visitors > max.average_visitors ? curr : max
    )
    : null;

  // Empty state
  if (!chartData.length) {
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
          No hourly visitor data available
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
      <div style={{ marginBottom: THEME_CONFIG.SPACING.lg }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: THEME_CONFIG.SPACING.sm,
            marginBottom: THEME_CONFIG.SPACING.xs
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
            Hourly Visitor Pattern
          </h3>
        </div>
        {peakHour && (
          <p
            className="card-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
              color: THEME_CONFIG.COLORS.textMuted,
              letterSpacing: '0.5px',
              margin: 0,
              marginLeft: '40px'
            }}
          >
            Peak: {peakHour.hour}:00 ({Math.round(peakHour.average_visitors)} visitors)
          </p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darkElectricBlue} stopOpacity={0.6} />
              <stop offset="95%" stopColor={darkElectricBlue} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            strokeOpacity={0.3}
          />

          <XAxis
            dataKey="hour"
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            tickFormatter={(value) => `${value}:00`}
          />

          <YAxis
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            allowDecimals={false}
          />

          <Tooltip
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
            labelFormatter={(value) => `${value}:00`}
            formatter={(value) => [
              `${Math.round(value)} visitors`,
              'Average'
            ]}
          />

          <Area
            type="monotone"
            dataKey="average_visitors"
            stroke={darkElectricBlue}
            strokeWidth={3}
            fill={`url(#${GRADIENT_ID})`}
            animationDuration={1000}
            dot={false}
            activeDot={{
              r: 6,
              fill: darkElectricBlue,
              stroke: THEME_CONFIG.COLORS.backgroundSecondary,
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyVisitorsAreaChart;
