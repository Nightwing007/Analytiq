/**
 * WorldHeatmap.jsx
 * Flat 2D World map heatmap visualization showing visitor distribution by country
 * Uses react-simple-maps for 2D map rendering
 */

import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Globe2, AlertCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

const darkElectricBlue = '#0066FF';
const accentPink = '#FF00E0';

// TopoJSON world map URL
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * Country name to ISO mapping for matching with TopoJSON
 */
const COUNTRY_NAME_MAP = {
  'United States': 'United States of America',
  'USA': 'United States of America',
  'UK': 'United Kingdom',
  'Russia': 'Russian Federation',
  'South Korea': 'Korea, Republic of',
  'Czech Republic': 'Czechia',
  'UAE': 'United Arab Emirates',
};

const WorldHeatmap = ({ data }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          padding: THEME_CONFIG.SPACING.xl,
          minHeight: '500px',
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
          No geographic data available
        </p>
      </div>
    );
  }

  // Process data: create lookup map by country name
  // Backend returns { country, percent } so we use percent as the value
  const countryDataMap = useMemo(() => {
    const map = {};
    data.forEach(item => {
      const location = item.country || item.city || item.location || 'Unknown';
      // Support both visitors/count/value format AND percent format from backend
      const value = item.visitors || item.count || item.value || item.percent || 0;
      // Store with original name and mapped name
      map[location] = value;
      const mappedName = COUNTRY_NAME_MAP[location];
      if (mappedName) {
        map[mappedName] = value;
      }
    });
    return map;
  }, [data]);

  // Check if data is in percent format (from backend) or visitor count format
  const isPercentFormat = useMemo(() => {
    return data.some(item => item.percent !== undefined && item.visitors === undefined);
  }, [data]);

  // Calculate totals - if percent format, total is 100%, otherwise sum visitors
  const totalVisitors = useMemo(() => {
    if (isPercentFormat) {
      return 100; // Percent-based, total is 100%
    }
    return data.reduce((sum, item) => {
      const visitors = item.visitors || item.count || item.value || 0;
      return sum + visitors;
    }, 0);
  }, [data, isPercentFormat]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map(item => item.visitors || item.count || item.value || item.percent || 0));
  }, [data]);

  // Color scale for heatmap - sky blue to dark blue gradient
  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain([0, maxValue * 0.33, maxValue * 0.66, maxValue])
      .range(['#87CEEB', '#4A90D9', '#1E5AA8', '#0066FF']);
  }, [maxValue]);

  const handleMouseEnter = (geo, event, value) => {
    const countryName = geo.properties.name;
    setTooltipContent({
      country: countryName,
      value: value,
      isPercent: isPercentFormat,
      percentage: isPercentFormat ? value.toFixed(1) : ((value / totalVisitors) * 100).toFixed(1)
    });
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleMouseMove = (event) => {
    if (tooltipContent) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.lg,
        minHeight: '500px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: THEME_CONFIG.SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <Globe2
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
              Global Visitor Heatmap
            </h3>
          </div>
          {/* Zoom Controls */}
          <div style={{ display: 'flex', gap: THEME_CONFIG.SPACING.xs }}>
            <button
              onClick={() => setZoom(z => Math.min(z * 1.5, 8))}
              style={{
                background: THEME_CONFIG.COLORS.backgroundDark,
                border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ZoomIn size={16} style={{ color: darkElectricBlue }} />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z / 1.5, 1))}
              style={{
                background: THEME_CONFIG.COLORS.backgroundDark,
                border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ZoomOut size={16} style={{ color: darkElectricBlue }} />
            </button>
          </div>
        </div>
        <p
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
            margin: `${THEME_CONFIG.SPACING.xs} 0 0 0`,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
          }}
        >
          Visitors from {data.length} {data.length === 1 ? 'country' : 'countries'}
        </p>
      </div>

      {/* Map Container */}
      <div
        style={{
          width: '100%',
          height: '350px',
          position: 'relative',
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          overflow: 'hidden',
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary
        }}
        onMouseMove={handleMouseMove}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20]
          }}
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <ZoomableGroup zoom={zoom} center={[0, 20]}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const visitors = countryDataMap[countryName] || 0;
                  const fillColor = visitors > 0 ? colorScale(visitors) : '#1a1a2e';
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => handleMouseEnter(geo, e, visitors)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#2a2a4e',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        },
                        hover: {
                          fill: fillColor,
                          stroke: darkElectricBlue,
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'brightness(1.3)'
                        },
                        pressed: {
                          fill: fillColor,
                          stroke: '#fff',
                          strokeWidth: 1,
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y - 10,
              background: 'rgba(0, 0, 0, 0.95)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: `2px solid ${darkElectricBlue}`,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
              color: THEME_CONFIG.COLORS.textPrimary,
              boxShadow: `0 0 20px ${darkElectricBlue}80`,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: darkElectricBlue }}>
              {tooltipContent.country}
            </div>
            {tooltipContent.value > 0 && (
              <div style={{ fontSize: '14px' }}>
                {tooltipContent.percentage}% of visitors
              </div>
            )}
            {tooltipContent.value === 0 && (
              <div style={{ fontSize: '12px', color: THEME_CONFIG.COLORS.textMuted }}>
                No visitors recorded
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: THEME_CONFIG.SPACING.md,
          padding: THEME_CONFIG.SPACING.sm,
          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}
      >
        <span
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
          }}
        >
          Visitor Density:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
          <span
            style={{
              color: THEME_CONFIG.COLORS.textMuted,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
            }}
          >
            Low
          </span>
          <div
            style={{
              width: '120px',
              height: '12px',
              background: 'linear-gradient(to right, #87CEEB, #4A90D9, #1E5AA8, #0066FF)',
              borderRadius: '6px',
              border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
            }}
          />
          <span
            style={{
              color: THEME_CONFIG.COLORS.textMuted,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
            }}
          >
            High
          </span>
        </div>
      </div>

      {/* Top Countries List */}
      <div
        style={{
          marginTop: THEME_CONFIG.SPACING.md,
          padding: THEME_CONFIG.SPACING.md,
          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}
      >
        <h4
          style={{
            color: THEME_CONFIG.COLORS.textPrimary,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
            fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.secondary,
            margin: `0 0 ${THEME_CONFIG.SPACING.sm} 0`
          }}
        >
          Top Countries
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: THEME_CONFIG.SPACING.xs }}>
          {data
            .sort((a, b) => (b.visitors || b.count || b.value || b.percent || 0) - (a.visitors || a.count || a.value || a.percent || 0))
            .slice(0, 5)
            .map((item, index) => {
              const location = item.country || item.city || item.location || 'Unknown';
              const value = item.visitors || item.count || item.value || item.percent || 0;
              // If percent format, value is already the percentage
              const percentage = isPercentFormat ? value.toFixed(1) : ((value / totalVisitors) * 100).toFixed(1);
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: `${THEME_CONFIG.SPACING.xs} 0`,
                    borderBottom: index < 4 ? `1px solid ${THEME_CONFIG.COLORS.borderPrimary}` : 'none'
                  }}
                >
                  <span
                    style={{
                      color: THEME_CONFIG.COLORS.textPrimary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
                      fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
                    }}
                  >
                    {index + 1}. {location}
                  </span>
                  <span
                    style={{
                      color: darkElectricBlue,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
                    }}
                  >
                    {percentage}%
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WorldHeatmap;
