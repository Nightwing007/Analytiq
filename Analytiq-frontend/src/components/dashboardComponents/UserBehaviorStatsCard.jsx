import React from 'react';
import { Users, UserCheck, FileText, Clock, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * Format duration in minutes and seconds
 */
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0m 0s';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}m ${sec}s`;
}

/**
 * Individual Stat Display Component
 */
const StatRow = ({ icon: Icon, label, value, isLast }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: THEME_CONFIG.SPACING.md,
      paddingBottom: isLast ? 0 : THEME_CONFIG.SPACING.lg,
      marginBottom: isLast ? 0 : THEME_CONFIG.SPACING.lg,
      borderBottom: isLast ? 'none' : `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
    }}
  >
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
        flexShrink: 0
      }}
    >
      <Icon size={20} style={{ color: darkElectricBlue }} />
    </div>

    {/* Label and Value */}
    <div style={{ flex: 1 }}>
      <div
        className="card-title"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
          color: THEME_CONFIG.COLORS.textMuted,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div
        className="cool-title"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.75rem',
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
          color: THEME_CONFIG.COLORS.textPrimary,
          letterSpacing: '1px',
          textShadow: `0 0 10px ${darkElectricBlue}22`,
          lineHeight: '1'
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

/**
 * UserBehaviorStatsCard
 * @param {Object} data - user_behavior object
 */
const UserBehaviorStatsCard = ({ data }) => {
  // Empty state
  if (!data) {
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
          No user behavior data available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 300ms ease',
        minHeight: '450px',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: darkElectricBlue }} />
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: THEME_CONFIG.SPACING.xl,
          marginTop: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: `${darkElectricBlue}20`,
            border: `2px solid ${darkElectricBlue}40`
          }}
        >
          <Users size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
        </div>
        <div>
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '4px'
            }}
          >
            User Behavior
          </h3>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '13px',
            color: THEME_CONFIG.COLORS.textSecondary,
            margin: 0
          }}>
            Session & Engagement Stats
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <StatRow
          icon={UserCheck}
          label="Sessions per User"
          value={data.avg_sessions_per_user?.toFixed(1) ?? '--'}
          isLast={false}
        />

        <StatRow
          icon={FileText}
          label="Pages per Session"
          value={data.avg_pages_per_session?.toFixed(1) ?? '--'}
          isLast={false}
        />

        <StatRow
          icon={Clock}
          label="Session Duration"
          value={formatDuration(data.avg_session_duration_sec)}
          isLast={true}
        />
      </div>
    </div>
  );
};

export default UserBehaviorStatsCard;
