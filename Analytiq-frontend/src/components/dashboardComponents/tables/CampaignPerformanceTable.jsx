import React, { useState } from 'react';
import { TrendingUp, AlertCircle, ChevronUp, ChevronDown, Target } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const columns = [
  { key: 'campaign', label: 'Campaign', sortable: true },
  { key: 'clicks', label: 'Clicks', sortable: true },
  { key: 'conversions', label: 'Conversions', sortable: true },
];

const CampaignPerformanceTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'clicks', direction: 'desc' });

  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
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
          No campaign data available
        </p>
      </div>
    );
  }

  const handleSort = (key) => {
    if (!columns.find(col => col.key === key)?.sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle null/undefined
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const SortableHeader = ({ column }) => (
    <th
      onClick={() => column.sortable && handleSort(column.key)}
      style={{
        padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        color: THEME_CONFIG.COLORS.textSecondary,
        borderBottom: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
        textAlign: 'left',
        cursor: column.sortable ? 'pointer' : 'default',
        transition: 'all 200ms ease',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}
      onMouseEnter={(e) => {
        if (column.sortable) {
          e.currentTarget.style.backgroundColor = `${darkElectricBlue}10`;
          e.currentTarget.style.color = darkElectricBlue;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = THEME_CONFIG.COLORS.backgroundDark;
        e.currentTarget.style.color = THEME_CONFIG.COLORS.textSecondary;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{column.label}</span>
        {column.sortable && (
          <div style={{ marginLeft: 'auto' }}>
            {sortConfig.key === column.key ? (
              sortConfig.direction === 'asc' ?
                <ChevronUp size={14} style={{ color: darkElectricBlue }} /> :
                <ChevronDown size={14} style={{ color: darkElectricBlue }} />
            ) : (
              <div style={{ width: '14px', height: '14px' }}></div>
            )}
          </div>
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
        transition: 'all 300ms ease',
        minHeight: '400px'
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
          marginBottom: THEME_CONFIG.SPACING.lg
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
          <Target size={18} style={{ color: darkElectricBlue }} />
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
          Campaign Performance
        </h3>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <SortableHeader key={col.key} column={col} />
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
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
                {columns.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: `${THEME_CONFIG.SPACING.md}`,
                      fontFamily: col.key === 'campaign' ? "'Rajdhani', sans-serif" : "'JetBrains Mono', monospace",
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: col.key === 'campaign' ? THEME_CONFIG.TYPOGRAPHY.fontWeight.medium : THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      color: col.key === 'campaign' ? THEME_CONFIG.COLORS.textPrimary : THEME_CONFIG.COLORS.textSecondary,
                      letterSpacing: col.key === 'campaign' ? '0.5px' : '0.5px'
                    }}
                  >
                    {row[col.key] != null ? (
                      typeof row[col.key] === 'number' ?
                        row[col.key].toLocaleString() :
                        row[col.key]
                    ) : '--'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: THEME_CONFIG.SPACING.md,
          paddingTop: THEME_CONFIG.SPACING.md,
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textMuted,
          fontFamily: "'Rajdhani', sans-serif",
          textAlign: 'center'
        }}
      >
        Showing {sortedData.length} campaign{sortedData.length !== 1 ? 's' : ''} • Click headers to sort
      </div>
    </div>
  );
};

export default CampaignPerformanceTable;
