/**
 * TopCountriesCard.jsx
 * Displays top countries by visitor percentage with professional UI
 */

import React, { useMemo, useState } from 'react';
import { MapPin, AlertCircle, TrendingUp, Globe, ChevronRight } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

// Country flag emoji mapping (common countries)
const COUNTRY_FLAGS = {
  'United States': '🇺🇸',
  'United States of America': '🇺🇸',
  'USA': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'UK': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'Brazil': '🇧🇷',
  'Russia': '🇷🇺',
  'Russian Federation': '🇷🇺',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'South Korea': '🇰🇷',
  'Mexico': '🇲🇽',
  'Indonesia': '🇮🇩',
  'Turkey': '🇹🇷',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Argentina': '🇦🇷',
  'South Africa': '🇿🇦',
  'Nigeria': '🇳🇬',
  'Egypt': '🇪🇬',
  'Singapore': '🇸🇬',
  'Malaysia': '🇲🇾',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Philippines': '🇵🇭',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Ireland': '🇮🇪',
  'Portugal': '🇵🇹',
  'Austria': '🇦🇹',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'New Zealand': '🇳🇿',
  'Israel': '🇮🇱',
  'UAE': '🇦🇪',
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
};

const getFlag = (country) => COUNTRY_FLAGS[country] || '🌍';

const TopCountriesCard = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
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
          No country data available
        </p>
      </div>
    );
  }

  // Check if data is in percent format or visitor count format
  const isPercentFormat = useMemo(() => {
    return data.some(item => item.percent !== undefined && item.visitors === undefined);
  }, [data]);

  // Calculate total visitors for percentage calculation
  const totalVisitors = useMemo(() => {
    if (isPercentFormat) {
      return 100;
    }
    return data.reduce((sum, item) => {
      const visitors = item.visitors || item.count || item.value || 0;
      return sum + visitors;
    }, 0);
  }, [data, isPercentFormat]);

  // Sort and get top countries
  const sortedCountries = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.visitors || b.count || b.value || b.percent || 0) - (a.visitors || a.count || a.value || a.percent || 0))
      .slice(0, 10);
  }, [data]);

  // Calculate max value for relative bar widths
  const maxPercentage = useMemo(() => {
    if (sortedCountries.length === 0) return 0;
    const first = sortedCountries[0];
    const value = first.visitors || first.count || first.value || first.percent || 0;
    return isPercentFormat ? value : ((value / totalVisitors) * 100);
  }, [sortedCountries, isPercentFormat, totalVisitors]);

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.lg,
        minHeight: '400px',
        transition: 'all 300ms ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.boxShadow = `0 0 25px ${darkElectricBlue}25, 0 8px 32px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Decorative top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${darkElectricBlue}, ${darkerElectricBlue}, transparent)`
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: THEME_CONFIG.SPACING.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${darkElectricBlue}30, ${darkerElectricBlue}20)`,
                border: `1px solid ${darkElectricBlue}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Globe
                size={22}
                style={{
                  color: darkElectricBlue,
                  filter: `drop-shadow(0 0 6px ${darkElectricBlue})`
                }}
              />
            </div>
            <div>
              <h3
                style={{
                  color: THEME_CONFIG.COLORS.textPrimary,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h4,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
                  fontFamily: "'Rajdhani', sans-serif",
                  margin: 0,
                  letterSpacing: '0.5px'
                }}
              >
                Top Countries
              </h3>
              <p
                style={{
                  color: THEME_CONFIG.COLORS.textMuted,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
                  margin: 0,
                  fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
                }}
              >
                Traffic distribution by region
              </p>
            </div>
          </div>
          
          {/* Stats badge */}
          <div
            style={{
              padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
              backgroundColor: `${darkElectricBlue}15`,
              border: `1px solid ${darkElectricBlue}30`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={14} style={{ color: darkElectricBlue }} />
            <span
              style={{
                color: darkElectricBlue,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {data.length} regions
            </span>
          </div>
        </div>
      </div>

      {/* Countries List */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto'
        }}
      >
        {sortedCountries.map((item, index) => {
          const location = item.country || item.city || item.location || 'Unknown';
          const value = item.visitors || item.count || item.value || item.percent || 0;
          const percentage = isPercentFormat ? value : ((value / totalVisitors) * 100);
          const displayPercentage = percentage.toFixed(1);
          const relativeWidth = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;
          const isHovered = hoveredIndex === index;
          const flag = getFlag(location);

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: THEME_CONFIG.SPACING.md,
                padding: '12px 14px',
                backgroundColor: isHovered ? `${darkElectricBlue}15` : THEME_CONFIG.COLORS.backgroundDark,
                borderRadius: '10px',
                border: `1px solid ${isHovered ? `${darkElectricBlue}50` : THEME_CONFIG.COLORS.borderPrimary}`,
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background progress bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${relativeWidth}%`,
                  background: `linear-gradient(90deg, ${darkElectricBlue}15, ${darkElectricBlue}05)`,
                  transition: 'width 500ms ease',
                  pointerEvents: 'none'
                }}
              />

              {/* Rank Badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: index < 3 
                    ? `linear-gradient(135deg, ${darkElectricBlue}, ${darkerElectricBlue})`
                    : THEME_CONFIG.COLORS.backgroundSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: index < 3 ? `0 0 10px ${darkElectricBlue}40` : 'none',
                  border: index < 3 ? 'none' : `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <span
                  style={{
                    color: index < 3 ? '#fff' : THEME_CONFIG.COLORS.textMuted,
                    fontSize: '13px',
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Flag */}
              <div
                style={{
                  fontSize: '20px',
                  lineHeight: 1,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {flag}
              </div>

              {/* Country Name */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                <span
                  style={{
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                    fontWeight: index < 3 ? THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold : THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                    fontFamily: "'Rajdhani', sans-serif",
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.3px'
                  }}
                >
                  {location}
                </span>
              </div>

              {/* Mini Progress Bar */}
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: `${THEME_CONFIG.COLORS.borderPrimary}80`,
                  borderRadius: '2px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    width: `${relativeWidth}%`,
                    height: '100%',
                    background: index < 3 
                      ? `linear-gradient(90deg, ${darkElectricBlue}, ${darkerElectricBlue})`
                      : darkElectricBlue,
                    borderRadius: '2px',
                    transition: 'width 500ms ease',
                    boxShadow: index < 3 ? `0 0 6px ${darkElectricBlue}60` : 'none'
                  }}
                />
              </div>

              {/* Percentage Value */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <span
                  style={{
                    color: index < 3 ? darkElectricBlue : THEME_CONFIG.COLORS.textSecondary,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
                    fontFamily: "'JetBrains Mono', monospace",
                    minWidth: '48px',
                    textAlign: 'right',
                    textShadow: index < 3 ? `0 0 10px ${darkElectricBlue}40` : 'none'
                  }}
                >
                  {displayPercentage}%
                </span>
                <ChevronRight 
                  size={14} 
                  style={{ 
                    color: THEME_CONFIG.COLORS.textMuted,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'all 200ms ease'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: THEME_CONFIG.SPACING.md,
          paddingTop: THEME_CONFIG.SPACING.sm,
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
          }}
        >
          Showing top {sortedCountries.length} of {data.length} countries
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >

        </div>
      </div>
    </div>
  );
};

export default TopCountriesCard;
