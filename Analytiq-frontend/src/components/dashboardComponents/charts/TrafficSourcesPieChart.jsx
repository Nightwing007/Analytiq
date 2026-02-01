import React from 'react';
import { RadialBarChart, RadialBar, Cell, Tooltip, ResponsiveContainer, Legend, PolarAngleAxis } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Electric blue palette for radial bars to match brand theme
const RADIAL_COLORS = [
  THEME_CONFIG.COLORS.electricBlue,      // Primary
  THEME_CONFIG.COLORS.electricBlueLight, // Light
  THEME_CONFIG.COLORS.electricBlueSecondary, // Medium
  THEME_CONFIG.COLORS.electricBlueDark,  // Dark
  '#004C66', // Deepest
  '#33DDFF', // Cyan/Light
];

const darkElectricBlue = THEME_CONFIG.COLORS.electricBlue;
const darkerElectricBlue = THEME_CONFIG.COLORS.electricBlueDark;

const TrafficSourcesPieChart = ({ data, totalVisitors: globalTotal = 0 }) => {
  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: '4px',
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
          No traffic source data available
        </p>
      </div>
    );
  }

  // Pre-process data for RadialBarChart
  const processedData = [...data].sort((a, b) => b.visitors - a.visitors).map((entry, index) => ({
    ...entry,
    name: entry.source,
    value: entry.visitors,
    fill: RADIAL_COLORS[index % RADIAL_COLORS.length]
  }));

  // Use globalTotal if provided, else fallback to sum of parts for the domain
  const localSum = processedData.reduce((sum, item) => sum + item.value, 0);
  const chartDomain = globalTotal > 0 ? globalTotal : localSum;

  return (
    <div
      style={{
        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '4px',
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}33, 0 4px 30px ${darkerElectricBlue}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${THEME_CONFIG.COLORS.electricBlue}33`;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: `2px solid ${darkElectricBlue}`, borderLeft: `2px solid ${darkElectricBlue}`, opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderBottom: `2px solid ${darkElectricBlue}`, borderRight: `2px solid ${darkElectricBlue}`, opacity: 0.4 }} />

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
            borderRadius: '4px',
            backgroundColor: `${darkElectricBlue}15`
          }}
        >
          <TrendingUp size={18} style={{ color: darkElectricBlue }} />
        </div>
        <h3
          className="card-title"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 700,
            color: THEME_CONFIG.COLORS.textSecondary,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: 0
          }}
        >
          Traffic Sources
        </h3>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="40%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            barSize={12}
            data={processedData}
            startAngle={180}
            endAngle={-180}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, chartDomain > 0 ? chartDomain : 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.03)' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                border: `1px solid ${darkElectricBlue}`,
                borderRadius: '4px',
                color: THEME_CONFIG.COLORS.textPrimary,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                padding: '8px',
                boxShadow: `0 0 20px ${darkElectricBlue}33`
              }}
              cursor={{ stroke: darkElectricBlue, strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value) => {
                const percent = chartDomain > 0 ? ((value / chartDomain) * 100).toFixed(1) : '0.0';
                return [`${value} visitors (${percent}%)`, 'Traffic'];
              }}
            />
            <Legend
              iconSize={10}
              iconType="square"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.8rem',
                lineHeight: '20px',
                paddingLeft: '20px'
              }}
              formatter={(value) => (
                <span style={{ color: THEME_CONFIG.COLORS.textSecondary, letterSpacing: '0.5px' }}>
                  {value}
                </span>
              )}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Subtle center icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.15)',
          border: `1px solid ${darkElectricBlue}15`
        }}>
          <TrendingUp size={14} style={{ color: darkElectricBlue, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
};

export default TrafficSourcesPieChart;
