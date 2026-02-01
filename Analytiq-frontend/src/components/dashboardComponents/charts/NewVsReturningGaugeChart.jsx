import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { UserPlus, AlertCircle, Users, UserCheck } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Electric blue color palette for new vs returning - matching theme
const COLORS = {
  new: '#00D4FF',      // Neon cyan-blue (fresh, new users)
  returning: '#00D4FF' // Primary electric blue (established users)
};

const darkElectricBlue = '#00D4FF';
const darkerElectricBlue = '#00D4FF';

/**
 * NewVsReturningGaugeChart
 * @param {Object} data - { new_percent: number, returning_percent: number }
 */
const NewVsReturningGaugeChart = ({ data }) => {
  // Empty state
  if (!data || typeof data.new_percent !== 'number' || typeof data.returning_percent !== 'number') {
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
            <UserPlus
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
              New vs Returning
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
            Visitor Type Breakdown
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
            {(data.new_percent + data.returning_percent).toFixed(0)}%
          </p>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '11px',
            color: THEME_CONFIG.COLORS.textMuted,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Coverage
          </p>
        </div>
      </div>

      {/* Donut Chart */}
      <div style={{ position: 'relative', height: '200px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              label={false}
            >
              <Cell fill={COLORS.new} stroke={THEME_CONFIG.COLORS.backgroundSecondary} strokeWidth={3} />
              <Cell fill={COLORS.returning} stroke={THEME_CONFIG.COLORS.backgroundSecondary} strokeWidth={3} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Display - Dominant Type */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: dominant.label === 'New' ? COLORS.new + '30' : COLORS.returning + '30',
              border: `2px solid ${dominant.label === 'New' ? COLORS.new : COLORS.returning}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            {dominant.label === 'New' ? (
              <Users size={24} style={{ color: COLORS.new }} strokeWidth={2.5} />
            ) : (
              <UserCheck size={24} style={{ color: COLORS.returning }} strokeWidth={2.5} />
            )}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '28px',
              fontWeight: 700,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0px',
              textShadow: `0 0 12px ${darkElectricBlue}33`,
              lineHeight: '1'
            }}
          >
            {dominant.value.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          paddingTop: '20px',
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}
      >
        {/* New Visitors Card */}
        <div
          style={{
            padding: '16px',
            backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
            borderRadius: '8px',
            border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.new;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.new}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: COLORS.new,
                boxShadow: `0 0 8px ${COLORS.new}66`
              }}
            />
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: THEME_CONFIG.COLORS.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              New Visitors
            </span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: COLORS.new,
              lineHeight: '1',
              textShadow: `0 0 10px ${COLORS.new}44`
            }}
          >
            {data.new_percent.toFixed(1)}%
          </div>
        </div>

        {/* Returning Visitors Card */}
        <div
          style={{
            padding: '16px',
            backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
            borderRadius: '8px',
            border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.returning;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.returning}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: COLORS.returning,
                boxShadow: `0 0 8px ${COLORS.returning}66`
              }}
            />
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                color: THEME_CONFIG.COLORS.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Returning Visitors
            </span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '32px',
              fontWeight: 700,
              color: COLORS.returning,
              lineHeight: '1',
              textShadow: `0 0 10px ${COLORS.returning}44`
            }}
          >
            {data.returning_percent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVsReturningGaugeChart;
