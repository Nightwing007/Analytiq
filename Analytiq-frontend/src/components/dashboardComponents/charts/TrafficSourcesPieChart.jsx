import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Electric blue color palette for pie slices (shades of blue only)
const ELECTRIC_BLUE_COLORS = [
  '#0066FF', // Primary electric blue
  '#0052CC', // Darker electric blue
  '#4D94FF', // Lighter blue
  '#1A75FF', // Medium blue
  '#0047B3', // Deep blue
  '#80B3FF', // Light blue
  '#003D99', // Very deep blue
  '#B3D1FF', // Very light blue
];

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const TrafficSourcesPieChart = ({ data }) => {
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
          No traffic source data available
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
          <TrendingUp size={18} style={{ color: darkElectricBlue }} />
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
          Traffic Sources
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="visitors"
            nameKey="source"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            label={({ source, visitors }) => `${source}: ${visitors}`}
            labelStyle={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '12px',
              fill: THEME_CONFIG.COLORS.textPrimary,
              fontWeight: 600
            }}
          >
            {data.map((entry, idx) => (
              <Cell 
                key={`cell-${idx}`} 
                fill={ELECTRIC_BLUE_COLORS[idx % ELECTRIC_BLUE_COLORS.length]}
                stroke={THEME_CONFIG.COLORS.backgroundSecondary}
                strokeWidth={2}
              />
            ))}
          </Pie>
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
              fontWeight: 600
            }}
          />
          <Legend 
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ 
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              color: THEME_CONFIG.COLORS.textSecondary,
              paddingTop: THEME_CONFIG.SPACING.md
            }}
            formatter={(value) => (
              <span style={{ color: THEME_CONFIG.COLORS.textSecondary }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficSourcesPieChart;
