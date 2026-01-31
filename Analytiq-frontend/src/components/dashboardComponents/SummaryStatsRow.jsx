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
        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '4px',
        padding: THEME_CONFIG.SPACING.md,
        transition: 'all 300ms ease',
        minHeight: '120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}33, 0 6px 25px ${darkerElectricBlue}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderTop: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderLeft: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderBottom: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderRight: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.1 }} />

      {/* Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
          backgroundColor: `${darkElectricBlue}15`,
          marginBottom: THEME_CONFIG.SPACING.sm,
          transition: 'all 300ms ease'
        }}
      >
        <Icon size={20} style={{ color: darkElectricBlue }} />
      </div>

      {/* Label */}
      <div
        className="dash-card-title"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.7rem',
          fontWeight: 600,
          color: THEME_CONFIG.COLORS.textMuted,
          letterSpacing: '1px',
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
