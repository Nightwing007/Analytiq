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
  refreshing = false
}) {
  return (
    <div 
      style={{ 
        position: 'relative',
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease',
        overflow: 'hidden'
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
      {/* Optional: Subtle accent line on left */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '4px',
          height: '100%',
          background: `linear-gradient(180deg, ${darkElectricBlue}, ${darkerElectricBlue})`,
          opacity: 0.6
        }}
      />

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
          {/* Website Name - Orbitron Font */}
          <h1 
            className="cool-title"
            style={{ 
              fontFamily: "'Orbitron', monospace",
              fontSize: '2rem',
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '1px',
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
              className="card-title"
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

          {/* Date Range Badge */}
          {dateRange && (
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
                border: `2px solid ${darkElectricBlue}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: 'transparent'
              }}
            >
              <Calendar size={14} style={{ color: darkElectricBlue }} />
              <span 
                className="card-title"
                style={{ 
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  color: darkElectricBlue,
                  letterSpacing: '0.5px'
                }}
              >
                {dateRange}
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
          {/* Last Updated */}
          {lastUpdated && (
            <div 
              style={{ 
                textAlign: 'right'
              }}
            >
              <div 
                style={{ 
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  color: THEME_CONFIG.COLORS.textMuted,
                  marginBottom: '4px'
                }}
              >
                Last Updated
              </div>
              <div 
                className="card-title"
                style={{ 
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  letterSpacing: '0.5px'
                }}
              >
                {new Date(lastUpdated).toLocaleString()}
              </div>
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
                padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                border: `2px solid ${darkElectricBlue}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: 'transparent',
                color: darkElectricBlue,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.6 : 1,
                transition: 'all 300ms ease',
                minHeight: '36px'
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
