import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { Globe2, AlertCircle, RotateCcw, ZoomIn, ZoomOut, Pause, Play, Move3D } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

/**
 * RecentVisitorsMap (now a globe)
 * @param {Array} data - last_24h_visitors_geo array: [{ lat, long, country, city, timestamp }, ...]
 */
const darkElectricBlue = '#0066FF';
const GLOBE_HEIGHT = 480;

const RecentVisitorsMap = ({ data }) => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [globeReady, setGlobeReady] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(null);
  const [globeHeight, setGlobeHeight] = useState(GLOBE_HEIGHT);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.6);

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
        <AlertCircle size={40} style={{ color: THEME_CONFIG.COLORS.textMuted, marginBottom: THEME_CONFIG.SPACING.md }} />
        <p style={{ color: THEME_CONFIG.COLORS.textMuted, fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary }}>
          No recent visitor data available
        </p>
      </div>
    );
  }

  // Convert recent visitors to globe points
  const globeData = data
    .filter(item => item && (item.lat !== undefined || item.latitude !== undefined) && (item.long !== undefined || item.lng !== undefined || item.lon !== undefined))
    .map(item => {
      const lat = item.lat ?? item.latitude ?? 0;
      const lng = item.long ?? item.lng ?? item.lon ?? 0;
      return {
        lat,
        lng,
        size: 1.2,
        color: darkElectricBlue,
        city: item.city || '',
        country: item.country || '',
        ts: item.timestamp || ''
      };
    });

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current && globeReady) {
      try {
        globeEl.current.controls().autoRotate = autoRotate;
        globeEl.current.controls().autoRotateSpeed = rotationSpeed;
      } catch (error) {
        console.warn('Globe controls not available:', error);
      }
    }
  }, [globeReady, autoRotate, rotationSpeed]);

  // Measure container dimensions to fill space
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGlobeWidth(Math.max(240, Math.floor(rect.width - 2)));
        setGlobeHeight(Math.max(400, Math.floor(rect.height - 2)));
      }
    };

    updateDimensions();

    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateDimensions());
      ro.observe(containerRef.current);
    } else {
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      if (ro && containerRef.current) ro.unobserve(containerRef.current);
      else window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Interactive controls
  const handleZoomIn = useCallback(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      const camera = globeEl.current.camera();
      if (controls && camera) {
        const currentDistance = camera.position.length();
        camera.position.setLength(Math.max(120, currentDistance * 0.8));
        controls.update();
      }
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      const camera = globeEl.current.camera();
      if (controls && camera) {
        const currentDistance = camera.position.length();
        camera.position.setLength(Math.min(500, currentDistance * 1.25));
        controls.update();
      }
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => !prev);
  }, []);

  const handleSpeedChange = useCallback((e) => {
    setRotationSpeed(parseFloat(e.target.value));
  }, []);

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.lg,
        transition: 'all 300ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 0 18px ${darkElectricBlue}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
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
              Recent Visitors (24h)
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm, backgroundColor: THEME_CONFIG.COLORS.backgroundDark, padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`, borderRadius: THEME_CONFIG.BORDER_RADIUS.small, border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}` }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall, color: THEME_CONFIG.COLORS.textMuted }}>Pins:</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: darkElectricBlue }}>{globeData.length}</span>
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
          Interactive 3D globe with visitor locations
        </p>
      </div>

      {/* Interactive Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: THEME_CONFIG.SPACING.md, 
        marginBottom: THEME_CONFIG.SPACING.sm,
        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
        border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        flexWrap: 'wrap'
      }}>
        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.xs }}>
          <button
            onClick={handleZoomIn}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small, backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
              cursor: 'pointer', transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = darkElectricBlue; e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary; e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundSecondary; }}
            title="Zoom In"
          >
            <ZoomIn size={16} style={{ color: THEME_CONFIG.COLORS.textSecondary }} />
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small, backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
              cursor: 'pointer', transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = darkElectricBlue; e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary; e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundSecondary; }}
            title="Zoom Out"
          >
            <ZoomOut size={16} style={{ color: THEME_CONFIG.COLORS.textSecondary }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, backgroundColor: THEME_CONFIG.COLORS.borderPrimary }} />

        {/* Auto Rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          style={{
            display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.xs,
            padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
            border: `1px solid ${autoRotate ? darkElectricBlue : THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small, 
            backgroundColor: autoRotate ? `${darkElectricBlue}20` : THEME_CONFIG.COLORS.backgroundSecondary,
            cursor: 'pointer', transition: 'all 200ms ease',
            fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: THEME_CONFIG.COLORS.textSecondary
          }}
          title={autoRotate ? 'Pause Rotation' : 'Start Rotation'}
        >
          {autoRotate ? <Pause size={14} style={{ color: darkElectricBlue }} /> : <Play size={14} style={{ color: THEME_CONFIG.COLORS.textSecondary }} />}
          <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
        </button>

        {/* Speed Slider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: THEME_CONFIG.SPACING.sm,
          padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}>
          <Move3D size={14} style={{ color: THEME_CONFIG.COLORS.textMuted, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: THEME_CONFIG.COLORS.textMuted, flexShrink: 0 }}>Speed</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={rotationSpeed}
            onChange={handleSpeedChange}
            style={{ 
              width: 120, 
              height: 6,
              cursor: 'pointer', 
              accentColor: darkElectricBlue,
              borderRadius: 3,
              background: `linear-gradient(to right, ${darkElectricBlue} 0%, ${darkElectricBlue} ${((rotationSpeed - 0.1) / 1.9) * 100}%, ${THEME_CONFIG.COLORS.borderPrimary} ${((rotationSpeed - 0.1) / 1.9) * 100}%, ${THEME_CONFIG.COLORS.borderPrimary} 100%)`
            }}
            title={`Speed: ${rotationSpeed.toFixed(1)}x`}
          />
          <span style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: '12px', 
            color: darkElectricBlue, 
            minWidth: 36,
            textAlign: 'right',
            fontWeight: 600
          }}>{rotationSpeed.toFixed(1)}x</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, backgroundColor: THEME_CONFIG.COLORS.borderPrimary }} />

        {/* Reset View */}
        <button
          onClick={handleResetView}
          style={{
            display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.xs,
            padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small, backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
            cursor: 'pointer', transition: 'all 200ms ease',
            fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: THEME_CONFIG.COLORS.textSecondary
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = darkElectricBlue; e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary; e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundSecondary; }}
          title="Reset View"
        >
          <RotateCcw size={14} style={{ color: THEME_CONFIG.COLORS.textSecondary }} />
          <span>Reset</span>
        </button>
      </div>

      <div ref={containerRef} style={{ 
        height: `${GLOBE_HEIGHT}px`, 
        width: '100%', 
        maxWidth: '100%', 
        borderRadius: THEME_CONFIG.BORDER_RADIUS.small, 
        overflow: 'hidden', 
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark, 
        border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Globe
          ref={globeEl}
          width={globeWidth}
          height={globeHeight}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl={null}
          pointsData={globeData}
          pointAltitude={0.10}
          pointRadius={0.35}
          pointColor="color"
          pointResolution={24}
          pointLabel={d => `
            <div style="background: ${THEME_CONFIG.COLORS.backgroundElevated}; border: 2px solid ${darkElectricBlue}; border-radius: ${THEME_CONFIG.BORDER_RADIUS.small}; padding: ${THEME_CONFIG.SPACING.sm}; font-family: 'Rajdhani', sans-serif; color: ${THEME_CONFIG.COLORS.textPrimary};">
              <div style="font-weight: 600; color: ${darkElectricBlue};">${d.city || d.country || 'Unknown'}</div>
              <div style="font-size:12px; color: ${THEME_CONFIG.COLORS.textSecondary};">${d.country ? `${d.country}` : ''} ${d.ts ? `<div style=\"margin-top:6px;color:${THEME_CONFIG.COLORS.textSecondary};font-size:11px;\">${new Date(d.ts).toLocaleString()}</div>` : ''}</div>
            </div>
          `}
          atmosphereColor={darkElectricBlue}
          atmosphereAltitude={0.15}
          animateIn={true}
          onGlobeReady={() => setGlobeReady(true)}
          enablePointerInteraction={true}
        />
      </div>

      {/* Interaction hint */}
      <p style={{ 
        textAlign: 'center', 
        color: THEME_CONFIG.COLORS.textMuted, 
        fontSize: '11px', 
        marginTop: THEME_CONFIG.SPACING.sm,
        fontFamily: "'Rajdhani', sans-serif"
      }}>
        🖱️ Drag to rotate • Scroll to zoom • Click pins for details
      </p>
    </div>
  );
};

export default RecentVisitorsMap;
