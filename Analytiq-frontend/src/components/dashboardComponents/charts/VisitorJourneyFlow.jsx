import React, { useState } from 'react';
import { GitBranch, AlertCircle, LogIn, LogOut, User, ChevronDown, X } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const VisitorJourneyFlow = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

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
          No visitor journey data available
        </p>
      </div>
    );
  }

  // Parse sample_journeys into a flat array for table display
  const journeys = [];
  if (data.sample_journeys && typeof data.sample_journeys === 'object') {
    Object.entries(data.sample_journeys).forEach(([visitor, steps]) => {
      steps.forEach((step, idx) => {
        journeys.push({
          visitor,
          ...step,
        });
      });
    });
  }

  const displayJourneys = journeys.slice(0, 5);

  // Modal component for full journey list
  const JourneyModal = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: THEME_CONFIG.SPACING.xl
      }}
      onClick={() => setShowModal(false)}
    >
      <div
        style={{
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          border: `2px solid ${darkElectricBlue}`,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          width: '90%',
          maxWidth: '900px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 0 40px ${darkElectricBlue}40`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: THEME_CONFIG.SPACING.lg,
            borderBottom: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
            <User size={20} style={{ color: darkElectricBlue }} />
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h5,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                color: THEME_CONFIG.COLORS.textPrimary,
                margin: 0
              }}
            >
              All Sample Journeys ({journeys.length})
            </h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              backgroundColor: 'transparent',
              color: THEME_CONFIG.COLORS.textSecondary,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${darkElectricBlue}20`;
              e.currentTarget.style.borderColor = darkElectricBlue;
              e.currentTarget.style.color = darkElectricBlue;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
              e.currentTarget.style.color = THEME_CONFIG.COLORS.textSecondary;
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable Table */}
        <div style={{ overflowY: 'auto', flex: 1, padding: THEME_CONFIG.SPACING.lg }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  position: 'sticky',
                  top: 0
                }}>
                  Visitor
                </th>
                <th style={{
                  padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  position: 'sticky',
                  top: 0
                }}>
                  Page
                </th>
                <th style={{
                  padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  position: 'sticky',
                  top: 0
                }}>
                  Timestamp
                </th>
                <th style={{
                  padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                  color: THEME_CONFIG.COLORS.textSecondary,
                  borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  position: 'sticky',
                  top: 0
                }}>
                  Session
                </th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((j, idx) => (
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
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    color: darkElectricBlue,
                    letterSpacing: '0.5px'
                  }}>
                    {j.visitor.substring(0, 8)}...
                  </td>
                  <td style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    color: THEME_CONFIG.COLORS.textSecondary
                  }}>
                    {j.page}
                  </td>
                  <td style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    color: THEME_CONFIG.COLORS.textMuted
                  }}>
                    {new Date(j.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    color: THEME_CONFIG.COLORS.textMuted,
                    letterSpacing: '0.5px'
                  }}>
                    {j.session_id?.substring(0, 8)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
      <div style={{ marginBottom: THEME_CONFIG.SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.sm }}>
          <GitBranch
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
            Visitor Journey Flow
          </h3>
        </div>
      </div>

      {/* Entry and Exit Pages Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: THEME_CONFIG.SPACING.lg,
        marginBottom: THEME_CONFIG.SPACING.xl
      }}>
        {/* Entry Pages */}
        <div
          style={{
            padding: THEME_CONFIG.SPACING.md,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: THEME_CONFIG.SPACING.xs,
            marginBottom: THEME_CONFIG.SPACING.sm
          }}>
            <LogIn size={16} style={{ color: darkElectricBlue }} />
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
              Common Entry Pages
            </h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Array.isArray(data.common_entry_pages) && data.common_entry_pages.length > 0 ? (
              data.common_entry_pages.slice(0, 5).map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    padding: `${THEME_CONFIG.SPACING.xs} 0`
                  }}
                >
                  <span
                    style={{
                      color: THEME_CONFIG.COLORS.textSecondary,
                      fontFamily: "'Rajdhani', sans-serif",
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginRight: THEME_CONFIG.SPACING.sm
                    }}
                  >
                    {e.page}
                  </span>
                  <span
                    className="cool-title"
                    style={{
                      color: darkElectricBlue,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      fontSize: '0.75rem',
                      flexShrink: 0
                    }}
                  >
                    {e.count || e.views}
                  </span>
                </div>
              ))
            ) : (
              <span style={{
                color: THEME_CONFIG.COLORS.textMuted,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontFamily: "'Rajdhani', sans-serif"
              }}>
                No entry pages
              </span>
            )}
          </div>
        </div>

        {/* Exit Pages */}
        <div
          style={{
            padding: THEME_CONFIG.SPACING.md,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            backgroundColor: THEME_CONFIG.COLORS.backgroundDark
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: THEME_CONFIG.SPACING.xs,
            marginBottom: THEME_CONFIG.SPACING.sm
          }}>
            <LogOut size={16} style={{ color: darkerElectricBlue }} />
            <h4
              className="card-title"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                color: darkerElectricBlue,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Common Exit Pages
            </h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Array.isArray(data.common_exit_pages) && data.common_exit_pages.length > 0 ? (
              data.common_exit_pages.slice(0, 5).map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    padding: `${THEME_CONFIG.SPACING.xs} 0`
                  }}
                >
                  <span
                    style={{
                      color: THEME_CONFIG.COLORS.textSecondary,
                      fontFamily: "'Rajdhani', sans-serif",
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginRight: THEME_CONFIG.SPACING.sm
                    }}
                  >
                    {e.page}
                  </span>
                  <span
                    className="cool-title"
                    style={{
                      color: darkerElectricBlue,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      fontSize: '0.75rem',
                      flexShrink: 0
                    }}
                  >
                    {e.count || e.views}
                  </span>
                </div>
              ))
            ) : (
              <span style={{
                color: THEME_CONFIG.COLORS.textMuted,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontFamily: "'Rajdhani', sans-serif"
              }}>
                No exit pages
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sample Journeys Section */}
      {journeys.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: THEME_CONFIG.SPACING.xs,
            marginBottom: THEME_CONFIG.SPACING.md
          }}>
            <User size={16} style={{ color: THEME_CONFIG.COLORS.textSecondary }} />
            <h4
              className="card-title"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                color: THEME_CONFIG.COLORS.textSecondary,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              Sample Journeys ({journeys.length})
            </h4>
          </div>

          {/* Journey Table */}
          <div style={{ overflowX: 'auto', marginBottom: THEME_CONFIG.SPACING.md }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    textAlign: 'left',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Visitor
                  </th>
                  <th style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
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
                    borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    textAlign: 'left',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Timestamp
                  </th>
                  <th style={{
                    padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                    backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    textAlign: 'left',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Session
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayJourneys.map((j, idx) => (
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
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      color: darkElectricBlue,
                      letterSpacing: '0.5px'
                    }}>
                      {j.visitor.substring(0, 8)}...
                    </td>
                    <td style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      color: THEME_CONFIG.COLORS.textSecondary
                    }}>
                      {j.page}
                    </td>
                    <td style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      color: THEME_CONFIG.COLORS.textMuted
                    }}>
                      {new Date(j.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{
                      padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      color: THEME_CONFIG.COLORS.textMuted,
                      letterSpacing: '0.5px'
                    }}>
                      {j.session_id?.substring(0, 8)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show More Button */}
          {journeys.length > 5 && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                  border: `2px solid ${darkElectricBlue}`,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                  backgroundColor: 'transparent',
                  color: darkElectricBlue,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  fontFamily: "'Rajdhani', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 300ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${darkElectricBlue}15`;
                  e.currentTarget.style.borderColor = darkerElectricBlue;
                  e.currentTarget.style.color = darkerElectricBlue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = darkElectricBlue;
                  e.currentTarget.style.color = darkElectricBlue;
                }}
              >
                <ChevronDown size={14} />
                Show All ({journeys.length - 5} more)
              </button>
            </div>
          )}

          {/* Journey Modal */}
          {showModal && <JourneyModal />}
        </>
      )}
    </div>
  );
};

export default VisitorJourneyFlow;
