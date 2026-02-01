/**
 * WorldHeatmap.jsx
 * Flat 2D World map heatmap visualization showing visitor distribution by country
 * Uses react-simple-maps for 2D map rendering
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { 
  Globe2, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Search,
  Palette,
  Download,
  Move,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const accentPink = '#FF00E0';

// Color theme presets
const COLOR_THEMES = {
  blue: {
    name: 'Ocean Blue',
    colors: ['#87CEEB', '#4A90D9', '#1E5AA8', '#0066FF'],
    gradient: 'linear-gradient(to right, #87CEEB, #4A90D9, #1E5AA8, #0066FF)'
  },
  green: {
    name: 'Forest Green',
    colors: ['#90EE90', '#3CB371', '#228B22', '#006400'],
    gradient: 'linear-gradient(to right, #90EE90, #3CB371, #228B22, #006400)'
  },
  purple: {
    name: 'Royal Purple',
    colors: ['#DDA0DD', '#BA55D3', '#9932CC', '#4B0082'],
    gradient: 'linear-gradient(to right, #DDA0DD, #BA55D3, #9932CC, #4B0082)'
  },
  heat: {
    name: 'Heat Map',
    colors: ['#FFFF00', '#FFA500', '#FF4500', '#FF0000'],
    gradient: 'linear-gradient(to right, #FFFF00, #FFA500, #FF4500, #FF0000)'
  },
  cyan: {
    name: 'Cyber Cyan',
    colors: ['#E0FFFF', '#00CED1', '#008B8B', '#00FFFF'],
    gradient: 'linear-gradient(to right, #E0FFFF, #00CED1, #008B8B, #00FFFF)'
  }
};

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
  const [center, setCenter] = useState([0, 20]);
  const [colorTheme, setColorTheme] = useState('blue');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [showOnlyWithData, setShowOnlyWithData] = useState(false);
  const containerRef = useRef(null);

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

  // Color scale for heatmap - uses selected theme
  const colorScale = useMemo(() => {
    const themeColors = COLOR_THEMES[colorTheme].colors;
    return scaleLinear()
      .domain([0, maxValue * 0.33, maxValue * 0.66, maxValue])
      .range(themeColors);
  }, [maxValue, colorTheme]);

  // Filter countries for search
  const matchingCountries = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return data
      .filter(item => {
        const location = item.country || item.city || item.location || '';
        return location.toLowerCase().includes(term);
      })
      .slice(0, 5);
  }, [data, searchTerm]);

  // Reset view handler
  const handleResetView = useCallback(() => {
    setZoom(1);
    setCenter([0, 20]);
    setHighlightedCountry(null);
    setSearchTerm('');
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Pan controls
  const handlePan = useCallback((direction) => {
    const panAmount = 30 / zoom;
    setCenter(prev => {
      switch (direction) {
        case 'up': return [prev[0], Math.min(prev[1] + panAmount, 80)];
        case 'down': return [prev[0], Math.max(prev[1] - panAmount, -60)];
        case 'left': return [Math.max(prev[0] - panAmount, -180), prev[1]];
        case 'right': return [Math.min(prev[0] + panAmount, 180), prev[1]];
        default: return prev;
      }
    });
  }, [zoom]);

  // Focus on country
  const focusOnCountry = useCallback((countryName) => {
    // Approximate country centers
    const countryCenters = {
      'United States': [-95, 38],
      'United States of America': [-95, 38],
      'China': [104, 35],
      'India': [78, 21],
      'Brazil': [-55, -10],
      'Russia': [100, 60],
      'Russian Federation': [100, 60],
      'Germany': [10, 51],
      'United Kingdom': [-2, 54],
      'France': [2, 46],
      'Japan': [138, 36],
      'Australia': [134, -25],
      'Canada': [-106, 56],
      'Italy': [12, 42],
      'Spain': [-4, 40],
      'Mexico': [-102, 23],
      'South Korea': [127, 36],
      'Netherlands': [5, 52],
      'Turkey': [35, 39],
      'Indonesia': [120, -2],
    };
    
    const center = countryCenters[countryName];
    if (center) {
      setCenter(center);
      setZoom(3);
    }
    setHighlightedCountry(countryName);
    setShowSearch(false);
    setSearchTerm('');
  }, []);

  // Export as image (simplified - creates a notification)
  const handleExport = useCallback(() => {
    // In a real implementation, you'd use html2canvas or similar
    alert('Export feature: In production, this would download the map as PNG/SVG');
  }, []);

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
      ref={containerRef}
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.lg,
        minHeight: isFullscreen ? '100vh' : '600px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: THEME_CONFIG.SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: THEME_CONFIG.SPACING.sm }}>
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
          
          {/* Control Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Search Toggle */}
            <ControlButton
              icon={Search}
              onClick={() => setShowSearch(!showSearch)}
              active={showSearch}
              title="Search Countries"
            />
            
            {/* Color Theme Toggle */}
            <ControlButton
              icon={Palette}
              onClick={() => setShowColorPicker(!showColorPicker)}
              active={showColorPicker}
              title="Change Color Theme"
            />
            
            {/* Show Only Countries With Data */}
            <ControlButton
              icon={showOnlyWithData ? Eye : EyeOff}
              onClick={() => setShowOnlyWithData(!showOnlyWithData)}
              active={showOnlyWithData}
              title={showOnlyWithData ? "Show All Countries" : "Show Only Countries With Data"}
            />

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', backgroundColor: THEME_CONFIG.COLORS.borderPrimary, margin: '0 4px' }} />
            
            {/* Zoom Controls */}
            <ControlButton icon={ZoomIn} onClick={() => setZoom(z => Math.min(z * 1.5, 8))} title="Zoom In" />
            <ControlButton icon={ZoomOut} onClick={() => setZoom(z => Math.max(z / 1.5, 1))} title="Zoom Out" />
            <ControlButton icon={RotateCcw} onClick={handleResetView} title="Reset View" />
            
            {/* Divider */}
            <div style={{ width: '1px', height: '24px', backgroundColor: THEME_CONFIG.COLORS.borderPrimary, margin: '0 4px' }} />
            
            {/* Export & Fullscreen */}
            <ControlButton icon={Download} onClick={handleExport} title="Export Map" />
            <ControlButton 
              icon={isFullscreen ? Minimize2 : Maximize2} 
              onClick={toggleFullscreen} 
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            />
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
          Visitors from {data.length} {data.length === 1 ? 'country' : 'countries'} • Zoom: {Math.round(zoom * 100)}%
        </p>
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: THEME_CONFIG.SPACING.lg,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
            border: `2px solid ${darkElectricBlue}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            padding: THEME_CONFIG.SPACING.md,
            zIndex: 100,
            minWidth: '250px',
            boxShadow: `0 0 20px ${darkElectricBlue}40`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm, marginBottom: THEME_CONFIG.SPACING.sm }}>
            <Search size={16} style={{ color: THEME_CONFIG.COLORS.textMuted }} />
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: THEME_CONFIG.COLORS.textPrimary,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                outline: 'none'
              }}
              autoFocus
            />
            <button
              onClick={() => { setShowSearch(false); setSearchTerm(''); }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
            >
              <X size={14} style={{ color: THEME_CONFIG.COLORS.textMuted }} />
            </button>
          </div>
          {matchingCountries.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {matchingCountries.map((item, idx) => {
                const location = item.country || item.city || item.location;
                const value = item.visitors || item.count || item.value || item.percent || 0;
                const percentage = isPercentFormat ? value.toFixed(1) : ((value / totalVisitors) * 100).toFixed(1);
                return (
                  <button
                    key={idx}
                    onClick={() => focusOnCountry(location)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: THEME_CONFIG.SPACING.sm,
                      background: THEME_CONFIG.COLORS.backgroundSecondary,
                      border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = darkElectricBlue;
                      e.currentTarget.style.backgroundColor = `${darkElectricBlue}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                      e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundSecondary;
                    }}
                  >
                    <span style={{ color: THEME_CONFIG.COLORS.textPrimary, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small }}>
                      {location}
                    </span>
                    <span style={{ color: darkElectricBlue, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small, fontWeight: 600 }}>
                      {percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {searchTerm && matchingCountries.length === 0 && (
            <p style={{ color: THEME_CONFIG.COLORS.textMuted, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small, margin: 0 }}>
              No countries found
            </p>
          )}
        </div>
      )}

      {/* Color Theme Picker */}
      {showColorPicker && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: THEME_CONFIG.SPACING.lg,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
            border: `2px solid ${darkElectricBlue}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            padding: THEME_CONFIG.SPACING.md,
            zIndex: 100,
            minWidth: '180px',
            boxShadow: `0 0 20px ${darkElectricBlue}40`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME_CONFIG.SPACING.sm }}>
            <span style={{ color: THEME_CONFIG.COLORS.textSecondary, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small, fontWeight: 600 }}>
              Color Theme
            </span>
            <button
              onClick={() => setShowColorPicker(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
            >
              <X size={14} style={{ color: THEME_CONFIG.COLORS.textMuted }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(COLOR_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => { setColorTheme(key); setShowColorPicker(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: THEME_CONFIG.SPACING.sm,
                  padding: THEME_CONFIG.SPACING.sm,
                  background: colorTheme === key ? `${darkElectricBlue}20` : 'transparent',
                  border: `1px solid ${colorTheme === key ? darkElectricBlue : THEME_CONFIG.COLORS.borderPrimary}`,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  if (colorTheme !== key) e.currentTarget.style.borderColor = `${darkElectricBlue}66`;
                }}
                onMouseLeave={(e) => {
                  if (colorTheme !== key) e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '12px',
                    background: theme.gradient,
                    borderRadius: '4px'
                  }}
                />
                <span style={{ color: THEME_CONFIG.COLORS.textPrimary, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small }}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pan Controls (Floating) */}
      <div
        style={{
          position: 'absolute',
          left: THEME_CONFIG.SPACING.lg,
          bottom: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          zIndex: 50
        }}
      >
        <PanButton direction="up" onClick={() => handlePan('up')} />
        <div style={{ display: 'flex', gap: '2px' }}>
          <PanButton direction="left" onClick={() => handlePan('left')} />
          <div
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
              border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small
            }}
          >
            <Move size={12} style={{ color: THEME_CONFIG.COLORS.textMuted }} />
          </div>
          <PanButton direction="right" onClick={() => handlePan('right')} />
        </div>
        <PanButton direction="down" onClick={() => handlePan('down')} />
      </div>

      {/* Map Container */}
      <div
        style={{
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 200px)' : '480px',
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
            scale: 160,
            center: [0, 20]
          }}
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ coordinates }) => setCenter(coordinates)}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const visitors = countryDataMap[countryName] || 0;
                  const isHighlighted = highlightedCountry === countryName || 
                    (COUNTRY_NAME_MAP[highlightedCountry] === countryName);
                  
                  // Skip countries without data if filter is active
                  if (showOnlyWithData && visitors === 0) {
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: 'transparent', stroke: 'transparent', outline: 'none' },
                          hover: { fill: 'transparent', stroke: 'transparent', outline: 'none' },
                          pressed: { fill: 'transparent', stroke: 'transparent', outline: 'none' }
                        }}
                      />
                    );
                  }
                  
                  const fillColor = visitors > 0 ? colorScale(visitors) : '#1a1a2e';
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => handleMouseEnter(geo, e, visitors)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        setHighlightedCountry(countryName);
                        setZoom(z => Math.min(z * 1.5, 6));
                      }}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: isHighlighted ? '#FFD700' : '#2a2a4e',
                          strokeWidth: isHighlighted ? 2 : 0.5,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          filter: isHighlighted ? 'brightness(1.4)' : 'none'
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
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          flexWrap: 'wrap',
          gap: THEME_CONFIG.SPACING.sm
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.md }}>
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
                background: COLOR_THEMES[colorTheme].gradient,
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
        
        {/* Highlighted Country Info */}
        {highlightedCountry && (
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <span style={{ color: THEME_CONFIG.COLORS.textMuted, fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small }}>
              Selected:
            </span>
            <span style={{ color: '#FFD700', fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.small, fontWeight: 600 }}>
              {highlightedCountry}
            </span>
            <button
              onClick={() => setHighlightedCountry(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
            >
              <X size={12} style={{ color: THEME_CONFIG.COLORS.textMuted }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const ControlButton = ({ icon: Icon, onClick, active = false, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: active ? `${darkElectricBlue}30` : THEME_CONFIG.COLORS.backgroundDark,
      border: `1px solid ${active ? darkElectricBlue : THEME_CONFIG.COLORS.borderPrimary}`,
      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
      padding: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 200ms ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = darkElectricBlue;
      e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = active ? darkElectricBlue : THEME_CONFIG.COLORS.borderPrimary;
      e.currentTarget.style.backgroundColor = active ? `${darkElectricBlue}30` : THEME_CONFIG.COLORS.backgroundDark;
    }}
  >
    <Icon size={16} style={{ color: darkElectricBlue }} />
  </button>
);

const PanButton = ({ direction, onClick }) => {
  const getArrow = () => {
    switch (direction) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'left': return '◀';
      case 'right': return '▶';
      default: return '';
    }
  };
  
  return (
    <button
      onClick={onClick}
      style={{
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
        cursor: 'pointer',
        color: darkElectricBlue,
        fontSize: '10px',
        transition: 'all 200ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundDark;
      }}
    >
      {getArrow()}
    </button>
  );
};

export default WorldHeatmap;
