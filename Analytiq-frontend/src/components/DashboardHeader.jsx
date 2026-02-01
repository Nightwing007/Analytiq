import React from 'react';
import { RefreshCw, Globe, Calendar } from 'lucide-react';
import { THEME_CONFIG } from '../config.js';

// Electric blue theme colors
const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const buttonBackground = 'rgb(18, 18, 24)';

/**
 * DashboardHeader.jsx
 * Displays the main site info header for the dashboard with cyberpunk electric blue theme.
 * Props:
 *   - websiteName: string
 *   - url: string
 *   - dateRange: string
 *   - lastUpdated: string (ISO)
 *   - onRefresh: function (optional)
 *   - refreshing: boolean (optional)
 */
export default function DashboardHeader({
  websiteName,
  url,
  dateRange,
  lastUpdated,
  onRefresh,
  refreshing = false,
  datePicker
}) {
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}33`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '4px',
        padding: THEME_CONFIG.SPACING.lg,
        transition: 'all 300ms ease',
        overflow: 'visible', // Changed from 'hidden' to allow dropdowns
        zIndex: 10
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
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderLeft: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderRight: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderLeft: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, borderRight: `2px solid ${THEME_CONFIG.COLORS.electricBlue}`, opacity: 0.2 }} />

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left Section - Site Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Website Name - Rajdhani Font */}
          <h1
            className="cool-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textShadow: `0 0 20px ${darkElectricBlue}33`,
              marginBottom: THEME_CONFIG.SPACING.sm,
              lineHeight: '1.2',
              wordBreak: 'break-word'
            }}
          >
            {websiteName || 'Untitled Site'}
          </h1>

          {/* Website URL - Rajdhani Font */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: THEME_CONFIG.SPACING.md
            }}
          >
            <Globe
              size={16}
              style={{
                color: THEME_CONFIG.COLORS.textMuted,
                flexShrink: 0
              }}
            />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="metric-value"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                color: THEME_CONFIG.COLORS.textSecondary,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                transition: 'color 300ms ease',
                wordBreak: 'break-all'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = darkElectricBlue;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = THEME_CONFIG.COLORS.textSecondary;
              }}
            >
              {url || 'No URL'}
            </a>
          </div>

          {/* Last Updated - Moved to Left Side */}
          {lastUpdated && (
            <div
              style={{
                textAlign: 'left',
                marginTop: THEME_CONFIG.SPACING.xs
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  color: THEME_CONFIG.COLORS.textMuted,
                  marginRight: '8px',
                  fontFamily: "'Rajdhani', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Last Updated:
              </span>
              <span
                className="metric-value"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  letterSpacing: '0.5px'
                }}
              >
                {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Metadata & Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: THEME_CONFIG.SPACING.md,
            minWidth: 'fit-content'
          }}
        >
          {/* Date Picker or Static Date Range - Moved to Right Section */}
          {datePicker ? (
            <div style={{ marginBottom: THEME_CONFIG.SPACING.xs }}>
              {datePicker}
            </div>
          ) : dateRange && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
                border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}`,
                borderRadius: '4px',
                backgroundColor: 'transparent',
                marginBottom: THEME_CONFIG.SPACING.sm
              }}
            >
              <Calendar size={14} style={{ color: THEME_CONFIG.COLORS.electricBlue }} />
              <span
                className="metric-value"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  color: THEME_CONFIG.COLORS.electricBlue,
                  letterSpacing: '0.5px'
                }}
              >
                {dateRange}
              </span>
            </div>
          )}


          {/* Refresh Button (Optional) */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="neon-border-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.md}`,
                border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}`,
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: THEME_CONFIG.COLORS.electricBlue,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.caption,
                fontWeight: 600,
                fontFamily: "'Rajdhani', sans-serif",
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.6 : 1,
                transition: 'all 300ms ease',
                minHeight: '32px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                if (!refreshing) {
                  e.target.style.backgroundColor = buttonBackground;
                  e.target.style.borderColor = darkerElectricBlue;
                  e.target.style.color = darkerElectricBlue;
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = darkElectricBlue;
                e.target.style.color = darkElectricBlue;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none'
                }}
              />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add spin animation for refresh icon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
