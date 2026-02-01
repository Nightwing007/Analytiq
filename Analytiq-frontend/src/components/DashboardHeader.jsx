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
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 300ms ease',
        overflow: 'visible',
        zIndex: 10,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 102, 255, 0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Top accent bar */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px', 
        backgroundColor: darkElectricBlue,
        borderRadius: '12px 12px 0 0'
      }} />

      {/* Main Content */}
      <div
        className="dashboard-header-content"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'relative',
          zIndex: 1,
          marginTop: '8px'
        }}
      >
        {/* Left Section - Site Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Website Name */}
          <h1
            className="cool-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textShadow: `0 0 20px ${darkElectricBlue}33`,
              marginBottom: '8px',
              lineHeight: '1.2',
              wordBreak: 'break-word'
            }}
          >
            {websiteName || 'Untitled Site'}
          </h1>

          {/* Website URL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap'
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
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                color: THEME_CONFIG.COLORS.textSecondary,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                transition: 'color 300ms ease',
                wordBreak: 'break-all',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
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

          {/* Last Updated */}
          {lastUpdated && (
            <div
              style={{
                textAlign: 'left',
                marginTop: '4px'
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
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
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
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

        {/* Right Section - Actions */}
        <div
          className="dashboard-header-actions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
            minWidth: 'fit-content'
          }}
        >
          {/* Date Picker */}
          {datePicker ? (
            <div style={{ marginBottom: '4px' }}>
              {datePicker}
            </div>
          ) : dateRange && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}`,
                borderRadius: '4px',
                backgroundColor: 'transparent',
                marginBottom: '8px'
              }}
            >
              <Calendar size={14} style={{ color: THEME_CONFIG.COLORS.electricBlue }} />
              <span
                className="metric-value"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  color: THEME_CONFIG.COLORS.electricBlue,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}
              >
                {dateRange}
              </span>
            </div>
          )}


          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="neon-border-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                border: `1px solid ${THEME_CONFIG.COLORS.electricBlue}`,
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: THEME_CONFIG.COLORS.electricBlue,
                fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
                fontWeight: 600,
                fontFamily: "'Rajdhani', sans-serif",
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.6 : 1,
                transition: 'all 300ms ease',
                minHeight: '32px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                whiteSpace: 'nowrap'
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

      {/* Add responsive styles and animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .dashboard-header-actions {
            width: 100% !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-wrap: wrap !important;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .dashboard-header-actions > * {
            width: 100% !important;
          }

          .neon-border-btn {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
