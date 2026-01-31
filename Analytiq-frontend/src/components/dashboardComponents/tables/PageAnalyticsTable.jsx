/**
 * PageAnalyticsTable.jsx - Detailed Page Metrics Table
 * Clean electric blue theme with professional modal
 */

import React, { useState, useMemo } from 'react';
import { THEME_CONFIG } from '../../../config.js';
import {
  ChevronUp,
  ChevronDown,
  Search,
  Eye,
  Users,
  Clock,
  TrendingDown,
  ExternalLink,
  Download,
  FileText,
  AlertCircle,
  X,
  BarChart3,
  MousePointer
} from 'lucide-react';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const PageAnalyticsTable = ({
  pages = [],
  title = "Page Analytics",
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'views', direction: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          padding: THEME_CONFIG.SPACING.xl
        }}
      >
        <div
          style={{
            height: '24px',
            backgroundColor: `${THEME_CONFIG.COLORS.borderPrimary}40`,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            marginBottom: THEME_CONFIG.SPACING.md,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: THEME_CONFIG.SPACING.sm }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                height: '48px',
                backgroundColor: `${THEME_CONFIG.COLORS.borderPrimary}20`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          padding: THEME_CONFIG.SPACING.xl,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
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
          No page analytics data available
        </p>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredAndSortedPages = useMemo(() => {
    let filtered = pages.filter(page =>
      page.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.path?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key] ?? 0;
        let bValue = b[sortConfig.key] ?? 0;
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [pages, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ sortKey, children }) => (
    <th
      onClick={() => handleSort(sortKey)}
      style={{
        cursor: 'pointer',
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
        transition: 'color 200ms ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = darkElectricBlue}
      onMouseLeave={(e) => e.currentTarget.style.color = THEME_CONFIG.COLORS.textSecondary}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ?
            <ChevronUp size={14} style={{ color: darkElectricBlue }} /> :
            <ChevronDown size={14} style={{ color: darkElectricBlue }} />
        )}
      </div>
    </th>
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
        e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME_CONFIG.SPACING.lg,
        flexWrap: 'wrap',
        gap: THEME_CONFIG.SPACING.md
      }}>
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
            <FileText size={18} style={{ color: darkElectricBlue }} />
          </div>
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h5,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '0.5px',
              margin: 0
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: THEME_CONFIG.SPACING.md }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: THEME_CONFIG.COLORS.textMuted
              }}
            />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '36px',
                paddingRight: THEME_CONFIG.SPACING.md,
                paddingTop: THEME_CONFIG.SPACING.sm,
                paddingBottom: THEME_CONFIG.SPACING.sm,
                border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                color: THEME_CONFIG.COLORS.textPrimary,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                outline: 'none',
                transition: 'border-color 200ms ease',
                minWidth: '200px'
              }}
              onFocus={(e) => e.target.style.borderColor = darkElectricBlue}
              onBlur={(e) => e.target.style.borderColor = THEME_CONFIG.COLORS.borderPrimary}
            />
          </div>

          {/* Export Button */}
          <button
            style={{
              display: 'flex',
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
              e.currentTarget.style.backgroundColor = darkElectricBlue;
              e.currentTarget.style.color = THEME_CONFIG.COLORS.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = darkElectricBlue;
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: THEME_CONFIG.SPACING.md }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
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
                Page Title
              </th>
              <SortableHeader sortKey="views">Views</SortableHeader>
              <SortableHeader sortKey="unique_visitors">Visitors</SortableHeader>
              <SortableHeader sortKey="avg_time_spent_sec">Avg Time</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPages.map((page, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`,
                  borderBottom: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease'
                }}
                onClick={() => { setModalPage(page); setModalOpen(true); }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${darkElectricBlue}08`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : `${THEME_CONFIG.COLORS.backgroundDark}40`}
              >
                <td style={{ padding: THEME_CONFIG.SPACING.md }}>
                  <div
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                      color: THEME_CONFIG.COLORS.textPrimary
                    }}
                  >
                    {page.page_title || 'Untitled'}
                  </div>
                  <div
                    style={{
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      color: THEME_CONFIG.COLORS.textMuted,
                      marginTop: '2px'
                    }}
                  >
                    {page.path}
                  </div>
                </td>
                <td style={{ padding: THEME_CONFIG.SPACING.md }}>
                  <div
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
                      color: THEME_CONFIG.COLORS.textPrimary,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {page.views?.toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: THEME_CONFIG.SPACING.md }}>
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                      color: THEME_CONFIG.COLORS.textSecondary
                    }}
                  >
                    {page.unique_visitors?.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: THEME_CONFIG.SPACING.md }}>
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                      color: THEME_CONFIG.COLORS.textSecondary
                    }}
                  >
                    {formatDuration(page.avg_time_spent_sec || 0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && modalPage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
              boxShadow: `0 0 40px ${darkElectricBlue}44`,
              border: `2px solid ${darkElectricBlue}`,
              padding: THEME_CONFIG.SPACING.xl,
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              style={{
                position: 'absolute',
                top: THEME_CONFIG.SPACING.md,
                right: THEME_CONFIG.SPACING.md,
                background: 'none',
                border: 'none',
                color: THEME_CONFIG.COLORS.textMuted,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 200ms ease'
              }}
              onClick={() => setModalOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.color = darkElectricBlue}
              onMouseLeave={(e) => e.currentTarget.style.color = THEME_CONFIG.COLORS.textMuted}
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: THEME_CONFIG.SPACING.lg, paddingRight: '2rem' }}>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h4,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  color: darkElectricBlue,
                  marginBottom: THEME_CONFIG.SPACING.xs,
                  letterSpacing: '0.5px'
                }}
              >
                {modalPage.page_title || 'Untitled'}
              </h3>
              <p
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                  color: THEME_CONFIG.COLORS.textMuted,
                  margin: 0
                }}
              >
                {modalPage.path}
              </p>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: THEME_CONFIG.SPACING.md }}>
              {/* Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: THEME_CONFIG.SPACING.md
                }}
              >
                <MetricItem icon={Eye} label="Views" value={modalPage.views?.toLocaleString()} />
                <MetricItem icon={Users} label="Unique Visitors" value={modalPage.unique_visitors?.toLocaleString()} />
                <MetricItem icon={Clock} label="Avg Time" value={formatDuration(modalPage.avg_time_spent_sec || 0)} />
                <MetricItem icon={TrendingDown} label="Bounce Rate" value={`${modalPage.bounce_rate_percent?.toFixed(1)}%`} />
              </div>

              {/* Additional Metrics */}
              <div
                style={{
                  borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
                  paddingTop: THEME_CONFIG.SPACING.md,
                  marginTop: THEME_CONFIG.SPACING.sm
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    marginBottom: THEME_CONFIG.SPACING.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Performance
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: THEME_CONFIG.SPACING.xs }}>
                  <DetailRow label="Load Time" value={`${modalPage.avg_load_time_ms || 0}ms`} />
                  <DetailRow label="Exit Rate" value={`${modalPage.exit_rate_percent || 0}%`} />
                  <DetailRow label="Scroll Depth" value={`${modalPage.avg_scroll_depth_percent || 0}%`} />
                </div>
              </div>

              {/* View Page Button */}
              <button
                style={{
                  marginTop: THEME_CONFIG.SPACING.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: THEME_CONFIG.SPACING.md,
                  border: `2px solid ${darkElectricBlue}`,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                  backgroundColor: 'transparent',
                  color: darkElectricBlue,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                  fontFamily: "'Rajdhani', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 300ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkElectricBlue;
                  e.currentTarget.style.color = THEME_CONFIG.COLORS.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkElectricBlue;
                }}
              >
                <ExternalLink size={16} />
                View Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          fontFamily: "'Rajdhani', sans-serif",
          color: THEME_CONFIG.COLORS.textMuted
        }}
      >
        Showing {filteredAndSortedPages.length} of {pages.length} pages
      </div>
    </div>
  );
};

// Helper Components
const MetricItem = ({ icon: Icon, label, value }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: THEME_CONFIG.SPACING.sm,
      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
      border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
      <Icon size={14} style={{ color: darkElectricBlue }} />
      <span
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </span>
    </div>
    <span
      style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
        color: THEME_CONFIG.COLORS.textPrimary,
        letterSpacing: '0.5px'
      }}
    >
      {value}
    </span>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
      fontFamily: "'Rajdhani', sans-serif"
    }}
  >
    <span style={{ color: THEME_CONFIG.COLORS.textMuted }}>{label}:</span>
    <span style={{ color: THEME_CONFIG.COLORS.textPrimary, fontWeight: 600 }}>{value}</span>
  </div>
);

export default PageAnalyticsTable;
