import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, Wifi, Monitor, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

// Electric blue gradient for screen resolutions
const RESOLUTION_COLORS = [
  '#0066FF', // Primary electric blue
  '#4D94FF', // Lighter blue
  '#1A75FF', // Medium blue
  '#0052CC', // Darker blue
  '#80B3FF'  // Light blue
];

const TechnologyStatsCard = ({ data }) => {
  // Empty state
  if (!data) {
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
          No technology data available
        </p>
      </div>
    );
  }

  const screenResData = Array.isArray(data.common_screen_resolutions)
    ? data.common_screen_resolutions.map((r) => ({
      resolution: r.resolution,
      percent: r.percent,
    }))
    : [];

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 300ms ease',
        minHeight: '450px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = darkElectricBlue;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 102, 255, 0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: darkElectricBlue }} />
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: THEME_CONFIG.SPACING.lg,
          marginTop: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: `${darkElectricBlue}20`,
            border: `2px solid ${darkElectricBlue}40`
          }}
        >
          <Cpu size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
        </div>
        <div>
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '4px'
            }}
          >
            Technology Details
          </h3>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '13px',
            color: THEME_CONFIG.COLORS.textSecondary,
            margin: 0
          }}>
            Network & Screen Metrics
          </p>
        </div>
      </div>

      {/* Network Stats */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: THEME_CONFIG.SPACING.md,
        marginBottom: THEME_CONFIG.SPACING.lg
      }}>
        {/* Avg Downlink */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: THEME_CONFIG.SPACING.md,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: `${darkElectricBlue}15`
              }}
            >
              <Wifi size={14} style={{ color: darkElectricBlue }} />
            </div>
            <span
              className="card-title"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                color: THEME_CONFIG.COLORS.textMuted,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Avg Downlink
            </span>
          </div>
          <span
            className="cool-title"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textShadow: `0 0 10px ${darkElectricBlue}22`
            }}
          >
            {data.avg_downlink_mbps != null ? `${data.avg_downlink_mbps.toFixed(1)} Mbps` : '--'}
          </span>
        </div>

        {/* Avg RTT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: THEME_CONFIG.SPACING.md,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: `${darkElectricBlue}15`
              }}
            >
              <Wifi size={14} style={{ color: darkElectricBlue }} />
            </div>
            <span
              className="card-title"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                color: THEME_CONFIG.COLORS.textMuted,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Avg RTT
            </span>
          </div>
          <span
            className="cool-title"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              textShadow: `0 0 10px ${darkElectricBlue}22`
            }}
          >
            {data.avg_rtt_ms != null ? `${Math.round(data.avg_rtt_ms)} ms` : '--'}
          </span>
        </div>
      </div>

      {/* Screen Resolutions Section */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: THEME_CONFIG.SPACING.xs,
          marginBottom: THEME_CONFIG.SPACING.sm
        }}>
          <Monitor size={14} style={{ color: darkElectricBlue }} />
          <p
            className="card-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              color: darkElectricBlue,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Screen Resolutions
          </p>
        </div>

        <div
          style={{
            padding: THEME_CONFIG.SPACING.md,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {screenResData.length > 0 ? (
            <ResponsiveContainer width="100%" height={100}>
              <BarChart
                data={screenResData}
                layout="vertical"
                margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  hide
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="resolution"
                  tick={{
                    fill: THEME_CONFIG.COLORS.textSecondary,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 11,
                    fontWeight: 500
                  }}
                  width={80}
                  stroke={THEME_CONFIG.COLORS.borderPrimary}
                />
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{
                    backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
                    border: `2px solid ${darkElectricBlue}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    padding: THEME_CONFIG.SPACING.sm,
                    boxShadow: `0 0 15px ${darkElectricBlue}33`
                  }}
                  formatter={(v) => [`${v.toFixed(1)}%`, 'Usage']}
                />
                <Bar
                  dataKey="percent"
                  radius={[0, 6, 6, 0]}
                  barSize={14}
                >
                  {screenResData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={RESOLUTION_COLORS[idx % RESOLUTION_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span
              style={{
                color: THEME_CONFIG.COLORS.textMuted,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontFamily: "'Rajdhani', sans-serif"
              }}
            >
              No resolution data
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyStatsCard;
