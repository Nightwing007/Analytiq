import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Globe2, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

/**
 * RecentVisitorsMap (now a globe)
 * @param {Array} data - last_24h_visitors_geo array: [{ lat, long, country, city, timestamp }, ...]
 */
const darkElectricBlue = '#0066FF';
const accentPink = '#FF00E0';

const RecentVisitorsMap = ({ data }) => {
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
          minHeight: '300px',
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
        size: 0.3,
        color: accentPink,
        city: item.city || '',
        country: item.country || '',
        ts: item.timestamp || ''
      };
    });

  // Auto-rotate globe
  useEffect(() => {
    if (globeEl.current && globeReady) {
      try {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.6;
      } catch (error) {
        console.warn('Globe controls not available:', error);
      }
    }
  }, [globeReady]);

  // Measure container width to prevent overflow
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGlobeWidth(Math.max(240, Math.floor(rect.width - 2)));
      }
    };

    updateWidth();

    let ro;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateWidth());
      ro.observe(containerRef.current);
    } else {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: THEME_CONFIG.SPACING.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: THEME_CONFIG.BORDER_RADIUS.small, backgroundColor: `${darkElectricBlue}15` }}>
            <Globe2 size={16} style={{ color: darkElectricBlue }} />
          </div>
          <h3 style={{ margin: 0, fontFamily: "'Rajdhani', sans-serif", fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h6 || '1rem', color: THEME_CONFIG.COLORS.textPrimary }}>
            Recent Visitors (24h)
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm, backgroundColor: THEME_CONFIG.COLORS.backgroundDark, padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`, borderRadius: THEME_CONFIG.BORDER_RADIUS.small, border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}` }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall, color: THEME_CONFIG.COLORS.textMuted }}>Pins:</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: accentPink }}>{globeData.length}</span>
        </div>
      </div>

      <div ref={containerRef} style={{ height: '300px', width: '100%', maxWidth: '100%', borderRadius: THEME_CONFIG.BORDER_RADIUS.small, overflow: 'hidden', backgroundColor: THEME_CONFIG.COLORS.backgroundDark, border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}` }}>
        <Globe
          ref={globeEl}
          width={globeWidth}
          height={300}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl={null}
          pointsData={globeData}
          pointAltitude="size"
          pointRadius={0.5}
          pointColor="color"
          pointLabel={d => `
            <div style="background: ${THEME_CONFIG.COLORS.backgroundElevated}; border: 2px solid ${darkElectricBlue}; border-radius: ${THEME_CONFIG.BORDER_RADIUS.small}; padding: ${THEME_CONFIG.SPACING.sm}; font-family: 'Rajdhani', sans-serif; color: ${THEME_CONFIG.COLORS.textPrimary};">
              <div style="font-weight: 600; color: ${darkElectricBlue};">${d.city || d.country || 'Unknown'}</div>
              <div style="font-size:12px; color: ${THEME_CONFIG.COLORS.textSecondary};">${d.country ? `${d.country}` : ''} ${d.ts ? `<div style=\"margin-top:6px;color:${THEME_CONFIG.COLORS.textSecondary};font-size:11px;\">${new Date(d.ts).toLocaleString()}</div>` : ''}</div>
            </div>
          `}
          atmosphereColor={darkElectricBlue}
          atmosphereAltitude={0.12}
          animateIn={true}
          onGlobeReady={() => setGlobeReady(true)}
          enablePointerInteraction={true}
        />
      </div>

      <p style={{ textAlign: 'center', color: THEME_CONFIG.COLORS.textMuted, fontSize: '12px', marginTop: THEME_CONFIG.SPACING.sm }}>last_24h_visitors_geo (globe)</p>
    </div>
  );
};

export default RecentVisitorsMap;
