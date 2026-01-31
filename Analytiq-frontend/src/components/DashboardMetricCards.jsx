import React from 'react';
import { Users, Eye, Clock, TrendingDown } from 'lucide-react';
import { THEME_CONFIG } from '../config.js';

// Electric blue theme colors
const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * DashboardMetricCards.jsx
 * Displays key metric cards with consistent electric blue theme.
 * Props:
 *   - totalVisitors: number
 *   - totalPageviews: number
 *   - avgTimeOnSiteSec: number
 *   - bounceRatePercent: number
 */

function formatDuration(seconds) {
  if (!seconds) return '0s';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

// Metric Card Component
function MetricCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <div
      className="dash-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '4px',
        padding: THEME_CONFIG.SPACING.lg,
        transition: 'all 300ms ease',
        minHeight: '140px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}33, 0 8px 30px ${darkerElectricBlue}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderLeft: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderBottom: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderRight: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.2 }} />

      {/* Icon Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: `${darkElectricBlue}15`,
          marginBottom: THEME_CONFIG.SPACING.md,
          transition: 'all 300ms ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${darkElectricBlue}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${darkElectricBlue}15`;
        }}
      >
        <Icon size={20} style={{ color: darkElectricBlue }} />
      </div>

      {/* Label */}
      <div
        className="dash-card-title"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 600,
          color: THEME_CONFIG.COLORS.textMuted,
          letterSpacing: '1px',
          marginBottom: THEME_CONFIG.SPACING.xs,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        className="metric-value"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '2rem',
          fontWeight: 700,
          color: THEME_CONFIG.COLORS.textPrimary,
          letterSpacing: '0.5px',
          textShadow: `0 0 10px ${THEME_CONFIG.COLORS.electricBlue}33`,
          lineHeight: '1.2'
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DashboardMetricCards({
  totalVisitors,
  totalPageviews,
  avgTimeOnSiteSec,
  bounceRatePercent
}) {
  const metrics = [
    {
      icon: Users,
      label: 'Total Visitors',
      value: totalVisitors?.toLocaleString() ?? '--',
      delay: 0.05
    },
    {
      icon: Eye,
      label: 'Total Pageviews',
      value: totalPageviews?.toLocaleString() ?? '--',
      delay: 0.1
    },
    {
      icon: Clock,
      label: 'Avg Time on Site',
      value: formatDuration(avgTimeOnSiteSec),
      delay: 0.15
    },
    {
      icon: TrendingDown,
      label: 'Bounce Rate',
      value: bounceRatePercent != null ? `${bounceRatePercent}%` : '--',
      delay: 0.2
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        width: '100%'
      }}
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          icon={metric.icon}
          label={metric.label}
          value={metric.value}
          delay={metric.delay}
        />
      ))}
    </div>
  );
}
