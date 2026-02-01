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
        className="dash-card"
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: '12px',
          padding: '24px',
          minHeight: '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <AlertCircle
          size={48}
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            marginBottom: '16px'
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
      className="dash-card"
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 0.4s ease',
        minHeight: '450px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 102, 255, 0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Accent bar at top */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px', 
        backgroundColor: darkElectricBlue,
        transition: 'height 0.3s ease'
      }} className="accent-bar" />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: THEME_CONFIG.SPACING.md
        }}
      >
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <TrendingUp
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
              Traffic Sources
            </h3>
          </div>
          <p
            style={{
              color: THEME_CONFIG.COLORS.textMuted,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
              margin: `${THEME_CONFIG.SPACING.xs} 0 0 0`,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
            }}
          >
            Visitor Origin Analysis
          </p>
        </div>
        <div style={{
          backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '20px',
            fontWeight: 700,
            color: darkElectricBlue,
            margin: 0,
            textShadow: `0 0 10px ${darkElectricBlue}44`
          }}>
            {globalTotal.toLocaleString()}
          </p>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '11px',
            color: THEME_CONFIG.COLORS.textMuted,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Total Visitors
          </p>
        </div>
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
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                border: `1px solid ${darkElectricBlue}`,
                borderRadius: '4px',
                color: '#FFFFFF',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                padding: '8px',
                boxShadow: `0 0 20px ${darkElectricBlue}33`
              }}
              labelStyle={{ color: '#FFFFFF' }}
              itemStyle={{ color: '#FFFFFF' }}
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
