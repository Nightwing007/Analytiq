import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { UserPlus, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Electric blue color palette for new vs returning
const COLORS = {
  new: '#4D94FF',      // Lighter blue (fresh, new users)
  returning: '#0052CC' // Darker blue (established users)
};

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * NewVsReturningGaugeChart
 * @param {Object} data - { new_percent: number, returning_percent: number }
 */
const NewVsReturningGaugeChart = ({ data }) => {
  // Empty state
  if (!data || typeof data.new_percent !== 'number' || typeof data.returning_percent !== 'number') {
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
          No visitor data available
        </p>
      </div>
    );
  }

  // Prepare data for gauge chart
  const chartData = [
    { name: 'New', value: data.new_percent },
    { name: 'Returning', value: data.returning_percent }
  ];

  // Determine dominant type for center display
  const dominant = data.new_percent >= data.returning_percent
    ? { label: 'New', value: data.new_percent }
    : { label: 'Returning', value: data.returning_percent };

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
          <UserPlus size={18} style={{ color: darkElectricBlue }} />
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
          New vs Returning
        </h3>
      </div>

      {/* Gauge Chart with Center Display */}
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              label={false}
            >
              <Cell fill={COLORS.new} stroke={THEME_CONFIG.COLORS.backgroundSecondary} strokeWidth={2} />
              <Cell fill={COLORS.returning} stroke={THEME_CONFIG.COLORS.backgroundSecondary} strokeWidth={2} />
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
              formatter={(value) => `${value.toFixed(1)}%`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Display */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            className="cool-title"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '3rem',
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '1px',
              textShadow: `0 0 15px ${darkElectricBlue}22`,
              lineHeight: '1',
              marginBottom: '8px'
            }}
          >
            {dominant.value.toFixed(0)}%
          </div>
          <div
            className="card-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
              color: THEME_CONFIG.COLORS.textMuted,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            {dominant.label}
          </div>
        </div>
      </div>

      {/* Legend Below Chart */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: THEME_CONFIG.SPACING.lg,
          marginTop: THEME_CONFIG.SPACING.md,
          paddingTop: THEME_CONFIG.SPACING.md,
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}
      >
        {chartData.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? COLORS.new : COLORS.returning
              }}
            />
            <span
              className="card-title"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                color: THEME_CONFIG.COLORS.textSecondary,
                letterSpacing: '0.5px'
              }}
            >
              {item.name}: {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewVsReturningGaugeChart;
