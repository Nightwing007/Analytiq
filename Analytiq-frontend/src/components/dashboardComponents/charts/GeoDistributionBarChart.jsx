import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Map, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Electric blue gradient palette for geographic distribution
const GEO_COLORS = [
  '#0066FF', '#4D94FF', '#1A75FF', '#0052CC', '#80B3FF', 
  '#003D99', '#B3D1FF', '#002966', '#00D4FF', '#0099CC'
];

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * GeoDistributionBarChart
 * @param {Array} data - geo_distribution array: [{ country: 'India', percent: 42.5 }, ...]
 */
const GeoDistributionBarChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          borderRadius: '12px',
          padding: '24px',
          minHeight: '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <AlertCircle
          size={48}
          style={{
            color: THEME_CONFIG.COLORS.textMuted,
            marginBottom: '16px'
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

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 0.4s ease',
        minHeight: '450px',
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
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px', 
        backgroundColor: darkElectricBlue
      }} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
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
            backgroundColor: darkElectricBlue + '20',
            border: `2px solid ${darkElectricBlue}40`
          }}
        >
          <Map size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
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
            Geographic Distribution
          </h3>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '13px',
            color: THEME_CONFIG.COLORS.textSecondary,
            margin: 0
          }}>
            Visitor Locations
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          barSize={28}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            tickFormatter={v => `${v}%`}
          />
          <YAxis 
            type="category" 
            dataKey="country" 
            tick={{
              fill: THEME_CONFIG.COLORS.textSecondary,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 13,
              fontWeight: 500
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            width={120}
          />
          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            contentStyle={{
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
              border: `1px solid ${darkElectricBlue}`,
              borderRadius: '4px',
              color: THEME_CONFIG.COLORS.textPrimary,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              padding: '8px',
              boxShadow: `0 0 20px ${darkElectricBlue}33`
            }}
            formatter={(v) => [`${v.toFixed(1)}%`, 'Usage']}
          />
          <Bar dataKey="percent" radius={[0, 8, 8, 0]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={GEO_COLORS[idx % GEO_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeoDistributionBarChart;
