import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { THEME_CONFIG } from '../config.js';
import DashboardMetricDeepDive from './dashboardComponents/DashboardMetricDeepDive.jsx';
import DashboardAIInsights from './dashboardComponents/DashboardAIInsights.jsx';

const FloatingAIWidget = ({ siteId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest('#ai-floating-icon')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '420px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: '70vh',
            background: THEME_CONFIG.COLORS.backgroundElevated,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.xlarge,
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
              borderBottom: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              background: `linear-gradient(135deg, ${THEME_CONFIG.COLORS.electricBlue}, ${THEME_CONFIG.COLORS.electricBlueSecondary})`
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                letterSpacing: '0.5px',
                fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
              }}
            >
              AI Workspace
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Close AI Workspace"
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: THEME_CONFIG.SPACING.md,
              padding: THEME_CONFIG.SPACING.md,
              overflowY: 'auto'
            }}
          >
            <DashboardMetricDeepDive siteId={siteId} />
            <DashboardAIInsights siteId={siteId} />
          </div>
        </div>
      )}

      <button
        id="ai-floating-icon"
        onClick={() => setIsOpen((open) => !open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          background: `radial-gradient(circle at 35% 35%, #ffffff33, rgba(0, 212, 255, 0.15)), ${THEME_CONFIG.COLORS.electricBlue}`,
          backgroundBlendMode: 'screen',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 35px rgba(0, 0, 0, 0.45), inset 0 0 8px rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          zIndex: 1100,
          transition: 'transform 0.25s ease'
        }}
        aria-label="Open AI workspace"
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Sparkles size={24} />
      </button>
    </>
  );
};

export default FloatingAIWidget;
