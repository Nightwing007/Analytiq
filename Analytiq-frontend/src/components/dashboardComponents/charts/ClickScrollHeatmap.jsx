import React, { useState } from 'react';
import { MousePointer, ArrowDown, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const lighterElectricBlue = '#4D94FF';

const ClickScrollHeatmap = ({ data }) => {
  const [showAllClicks, setShowAllClicks] = useState(false);
  const [showAllScrolls, setShowAllScrolls] = useState(false);

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
          No heatmap data available
        </p>
      </div>
    );
  }

  // Parse click_data into a flat array for table display
  const clickRows = [];
  if (data.click_data && typeof data.click_data === 'object') {
    Object.entries(data.click_data).forEach(([page, positions]) => {
      if (positions && typeof positions === 'object') {
        Object.entries(positions).forEach(([pos, count]) => {
          clickRows.push({ page, pos, count });
        });
      }
    });
  }

  // Parse scroll_analysis into a flat array for table display
  const scrollRows = [];
  if (data.scroll_analysis && typeof data.scroll_analysis === 'object') {
    Object.entries(data.scroll_analysis).forEach(([page, stats]) => {
      scrollRows.push({
        page,
        avg: stats.avg_scroll_depth,
        max: stats.max_scroll_depth,
      });
    });
  }

  const displayClickRows = showAllClicks ? clickRows : clickRows.slice(0, 5);
  const displayScrollRows = showAllScrolls ? scrollRows : scrollRows.slice(0, 5);

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        padding: THEME_CONFIG.SPACING.xl,
        transition: 'all 300ms ease'
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
          gap: THEME_CONFIG.SPACING.sm,
          marginBottom: THEME_CONFIG.SPACING.xl
        }}
      >
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
          <MousePointer size={18} style={{ color: darkElectricBlue }} />
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
          Click & Scroll Heatmap
        </h3>
      </div>

      {/* Click Data Section */}
      <div style={{ marginBottom: THEME_CONFIG.SPACING.xl }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: THEME_CONFIG.SPACING.xs,
          marginBottom: THEME_CONFIG.SPACING.md
        }}>
          <MousePointer size={16} style={{ color: darkElectricBlue }} />
          <h4
            className="card-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              color: darkElectricBlue,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Click Data {clickRows.length > 0 && `(${clickRows.length})`}
          </h4>
        </div>

        {clickRows.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto', marginBottom: THEME_CONFIG.SPACING.md }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${darkElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Page
                    </th>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${darkElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Position
                    </th>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${darkElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayClickRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`,
                        borderBottom: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                        transition: 'background-color 200ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${darkElectricBlue}08`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`;
                      }}
                    >
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        color: THEME_CONFIG.COLORS.textSecondary
                      }}>
                        {row.page}
                      </td>
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        color: THEME_CONFIG.COLORS.textMuted
                      }}>
                        {row.pos}
                      </td>
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Orbitron', monospace",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                        color: darkElectricBlue,
                        letterSpacing: '0.5px'
                      }}>
                        {row.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {clickRows.length > 5 && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowAllClicks(!showAllClicks)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
                    border: `1px solid ${darkElectricBlue}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    backgroundColor: 'transparent',
                    color: darkElectricBlue,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                    fontFamily: "'Rajdhani', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${darkElectricBlue}15`;
                    e.currentTarget.style.borderColor = darkerElectricBlue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = darkElectricBlue;
                  }}
                >
                  {showAllClicks ? (
                    <>
                      <ChevronUp size={12} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Show {clickRows.length - 5} More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{
            padding: THEME_CONFIG.SPACING.lg,
            textAlign: 'center',
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
            fontFamily: "'Rajdhani', sans-serif",
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
          }}>
            No click data available
          </div>
        )}
      </div>

      {/* Scroll Analysis Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: THEME_CONFIG.SPACING.xs,
          marginBottom: THEME_CONFIG.SPACING.md
        }}>
          <ArrowDown size={16} style={{ color: lighterElectricBlue }} />
          <h4
            className="card-title"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              color: lighterElectricBlue,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Scroll Analysis {scrollRows.length > 0 && `(${scrollRows.length})`}
          </h4>
        </div>

        {scrollRows.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto', marginBottom: THEME_CONFIG.SPACING.md }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${lighterElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Page
                    </th>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${lighterElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Avg Depth
                    </th>
                    <th style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      borderBottom: `2px solid ${lighterElectricBlue}`,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      textAlign: 'left',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Max Depth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayScrollRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`,
                        borderBottom: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                        transition: 'background-color 200ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${lighterElectricBlue}08`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`;
                      }}
                    >
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        color: THEME_CONFIG.COLORS.textSecondary
                      }}>
                        {row.page}
                      </td>
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Orbitron', monospace",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                        color: lighterElectricBlue,
                        letterSpacing: '0.5px'
                      }}>
                        {row.avg != null ? `${row.avg}%` : '--'}
                      </td>
                      <td style={{
                        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                        fontFamily: "'Orbitron', monospace",
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                        color: lighterElectricBlue,
                        letterSpacing: '0.5px'
                      }}>
                        {row.max != null ? `${row.max}%` : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {scrollRows.length > 5 && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowAllScrolls(!showAllScrolls)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: `${THEME_CONFIG.SPACING.xs} ${THEME_CONFIG.SPACING.sm}`,
                    border: `1px solid ${lighterElectricBlue}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    backgroundColor: 'transparent',
                    color: lighterElectricBlue,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                    fontFamily: "'Rajdhani', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${lighterElectricBlue}15`;
                    e.currentTarget.style.borderColor = darkElectricBlue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = lighterElectricBlue;
                  }}
                >
                  {showAllScrolls ? (
                    <>
                      <ChevronUp size={12} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Show {scrollRows.length - 5} More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{
            padding: THEME_CONFIG.SPACING.lg,
            textAlign: 'center',
            color: THEME_CONFIG.COLORS.textMuted,
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
            fontFamily: "'Rajdhani', sans-serif",
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
          }}>
            No scroll data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickScrollHeatmap;
