import React from 'react';
import { FileText, Gauge, UserCheck } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

// Electric blue theme colors
const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * SummaryStatsRow.jsx
 * Displays summary statistics with consistent electric blue theme.
 * Props:
 *   - totalPages: number
 *   - avgLoadingTimeMs: number
 *   - uniqueVisitors: number
 */

// Summary Stat Card Component
function SummaryStatCard({ icon: Icon, label, value, unit, delay = 0 }) {
  return (
    <div
      className="dash-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 300ms ease',
        minHeight: '140px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`,
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
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: darkElectricBlue }} />

      {/* Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          backgroundColor: `${darkElectricBlue}20`,
          border: `2px solid ${darkElectricBlue}40`,
          marginBottom: THEME_CONFIG.SPACING.sm,
          transition: 'all 300ms ease'
        }}
      >
        <Icon size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
      </div>

      {/* Label */}
      <div
        className="dash-card-title"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          color: THEME_CONFIG.COLORS.textSecondary,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: THEME_CONFIG.SPACING.xs
        }}
      >
        {label}
      </div>

      {/* Value with optional unit */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span
          className="metric-value"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.75rem',
            fontWeight: 700,
            color: THEME_CONFIG.COLORS.textPrimary,
            letterSpacing: '0.5px',
            textShadow: `0 0 10px ${THEME_CONFIG.COLORS.electricBlue}33`,
            lineHeight: '1'
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="metric-value"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 500,
              color: THEME_CONFIG.COLORS.electricBlue,
              letterSpacing: '0.5px'
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div >
  );
}

const SummaryStatsRow = ({ totalPages, avgLoadingTimeMs, uniqueVisitors }) => {
  const stats = [
    {
      icon: FileText,
      label: 'Total Pages',
      value: totalPages ?? '--',
      unit: null,
      delay: 0.05
    },
    {
      icon: Gauge,
      label: 'Avg Loading Time',
      value: avgLoadingTimeMs ?? '--',
      unit: avgLoadingTimeMs ? 'ms' : null,
      delay: 0.1
    },
    {
      icon: UserCheck,
      label: 'Unique Visitors',
      value: uniqueVisitors ?? '--',
      unit: null,
      delay: 0.15
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        width: '100%'
      }}
    >
      {stats.map((stat, index) => (
        <SummaryStatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          delay={stat.delay}
        />
      ))}
    </div>
  );
};

export default SummaryStatsRow;
