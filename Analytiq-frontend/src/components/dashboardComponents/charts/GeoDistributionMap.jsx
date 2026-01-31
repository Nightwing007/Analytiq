/**
 * GeoDistributionMap.jsx
 * 3D Globe visualization with electric blue theme using three-globe
 */

import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Globe2, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const lighterElectricBlue = '#4D94FF';

/**
 * Convert country/city data to lat/lng coordinates
 */
const getCoordinates = (location) => {
  const coords = {
    'United States': { lat: 37.0902, lng: -95.7129 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Mexico': { lat: 23.6345, lng: -102.5528 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
  };
  
  return coords[location] || { lat: 0, lng: 0 };
};

const GeoDistributionMap = ({ data }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [globeReady, setGlobeReady] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(null);

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

  // Convert data to globe points with proper null checking
  const globeData = data
    .filter(item => item && (item.country || item.city || item.location))
    .map(item => {
      const location = item.country || item.city || item.location || 'Unknown';
      const coords = getCoordinates(location);
      const visitors = item.visitors || item.count || item.value || 0;
      
      return {
        lat: coords.lat,
        lng: coords.lng,
        size: Math.log(visitors + 1) * 0.5,
        visitors: visitors,
        location: location,
        color: darkElectricBlue
      };
    });

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current && globeReady) {
      try {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
      } catch (error) {
        console.warn('Globe controls not available:', error);
      }
    }
  }, [globeReady]);

  // Measure container width and keep globe responsive to prevent overflow
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Subtract a small margin to avoid scrollbar/overflow rounding issues
        setGlobeWidth(Math.max(300, Math.floor(rect.width - 2)));
      }
    };

    updateWidth();

    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateWidth());
      ro.observe(containerRef.current);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', updateWidth);
    }

    return () => {
      if (ro && containerRef.current) ro.unobserve(containerRef.current);
      else window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease',
        minHeight: '500px'
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
      {/* Header */}
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: THEME_CONFIG.SPACING.lg,
          flexWrap: 'wrap',
          gap: THEME_CONFIG.SPACING.sm
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              backgroundColor: `${darkElectricBlue}15`
            }}
          >
            <Globe2 size={18} style={{ color: darkElectricBlue }} />
          </div>
          <h3 
            className="card-title"
            style={{ 
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h5,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              margin: 0
            }}
          >
            Geographic Distribution
          </h3>
        </div>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: THEME_CONFIG.SPACING.sm,
          padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
            color: THEME_CONFIG.COLORS.textMuted,
            textTransform: 'uppercase'
          }}>
            Locations:
          </span>
          <span style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
            fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
            color: darkElectricBlue,
            letterSpacing: '0.5px'
          }}>
            {globeData.length}
          </span>
        </div>
      </div>


{/* Globe Container */}
<div
  ref={containerRef}
  style={{
    height: '400px',
    width: '100%',
    maxWidth: '100%',
    position: 'relative',
    backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
    border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
    overflow: 'hidden'
  }}
>
  <Globe
    ref={globeEl}
    width={globeWidth}
    height={400}
    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
    
    pointsData={globeData}
    pointAltitude="size"
    pointRadius={0.6}
    pointColor="color"
    pointLabel={d => `
      <div style="
        background: ${THEME_CONFIG.COLORS.backgroundElevated};
        border: 2px solid ${darkElectricBlue};
        border-radius: ${THEME_CONFIG.BORDER_RADIUS.small};
        padding: ${THEME_CONFIG.SPACING.sm};
        font-family: 'Rajdhani', sans-serif;
        color: ${THEME_CONFIG.COLORS.textPrimary};
        box-shadow: 0 0 15px ${darkElectricBlue}33;
      ">
        <div style="font-weight: 600; margin-bottom: 4px; color: ${darkElectricBlue};">
          ${d.location}
        </div>
        <div style="font-size: 12px; color: ${THEME_CONFIG.COLORS.textSecondary};">
          Visitors: ${d.visitors.toLocaleString()}
        </div>
      </div>
    `}
    
    atmosphereColor={darkElectricBlue}
    atmosphereAltitude={0.15}
    animateIn={true}
    onGlobeReady={() => setGlobeReady(true)}
    enablePointerInteraction={true}
  />
</div>


      {/* Top Locations List */}
      <div style={{ marginTop: THEME_CONFIG.SPACING.lg }}>
        <h4 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
          color: THEME_CONFIG.COLORS.textSecondary,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: THEME_CONFIG.SPACING.sm
        }}>
          Top Locations
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: THEME_CONFIG.SPACING.sm
        }}>
          {data.slice(0, 6).map((location, idx) => {
            const visitors = location.visitors || location.count || location.value || 0;
            const name = location.country || location.city || location.location || 'Unknown';
            
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: THEME_CONFIG.SPACING.sm,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                  border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = darkElectricBlue;
                  e.currentTarget.style.backgroundColor = `${darkElectricBlue}05`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                  e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundDark;
                }}
              >
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {name}
                </span>
                <span style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  color: darkElectricBlue,
                  letterSpacing: '0.5px',
                  marginLeft: THEME_CONFIG.SPACING.sm,
                  flexShrink: 0
                }}>
                  {visitors.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GeoDistributionMap;
