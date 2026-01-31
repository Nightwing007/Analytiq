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
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease',
        minHeight: '160px',
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
      {/* Icon Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
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
        <Icon size={24} style={{ color: darkElectricBlue }} />
      </div>

      {/* Label */}
      <div
        className="card-title"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
          color: THEME_CONFIG.COLORS.textMuted,
          letterSpacing: '0.5px',
          marginBottom: THEME_CONFIG.SPACING.sm,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        className="cool-title"
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '2.5rem',
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
          color: THEME_CONFIG.COLORS.textPrimary,
          letterSpacing: '1px',
          textShadow: `0 0 15px ${darkElectricBlue}22`,
          lineHeight: '1.1'
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
