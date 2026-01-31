import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

// Electric blue gradient palette for different browsers
const BROWSER_COLORS = {
  'Chrome': '#0066FF',     // Primary electric blue
  'Safari': '#4D94FF',     // Lighter blue
  'Firefox': '#1A75FF',    // Medium blue
  'Edge': '#0052CC',       // Darker blue
  'Opera': '#80B3FF',      // Light blue
  'Other': '#003D99',      // Very dark blue
  'Brave': '#B3D1FF',      // Very light blue
  'Unknown': '#002966'     // Darkest blue
};

// Fallback colors for any browser not in the map
const FALLBACK_COLORS = [
  '#0066FF', '#4D94FF', '#1A75FF', '#0052CC', '#80B3FF', '#003D99'
];

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * Get color for browser name
 */
const getColorForBrowser = (browserName, index) => {
  return BROWSER_COLORS[browserName] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

/**
 * BrowsersBarChart - VERTICAL bars
 * @param {Array} data - Array of browser objects: [{ name: 'Chrome', percent: 60.0 }, ...]
 */
const BrowsersBarChart = ({ data }) => {
  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
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
          No browser data available
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
          <Globe size={18} style={{ color: darkElectricBlue }} />
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
          Browsers
        </h3>
      </div>

      {/* Chart - VERTICAL BARS */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          barSize={40}
        >
          <XAxis
            dataKey="name"
            tick={{
              fill: THEME_CONFIG.COLORS.textSecondary,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              fontWeight: 500
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            angle={-45}
            textAnchor="end"
            height={60}
          />

          <YAxis
            domain={[0, 100]}
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            tickFormatter={(v) => `${v}%`}
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
            formatter={(value) => [`${value.toFixed(1)}%`, 'Usage']}
          />

          <Bar
            dataKey="percent"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorForBrowser(entry.name, index)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrowsersBarChart;
