import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Legend, PolarAngleAxis } from 'recharts';
import { Monitor, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../../config.js';

// Device-specific electric blue palette to match brand theme
const DEVICE_COLORS = {
  desktop: THEME_CONFIG.COLORS.electricBlue,      // Brand Blue
  mobile: THEME_CONFIG.COLORS.electricBlueLight, // Lighter Blue
  tablet: THEME_CONFIG.COLORS.electricBlueSecondary, // Medium Blue
  smarttv: '#007799', // Darker Blue
  other: '#004C66'    // Deepest Blue
};

const darkElectricBlue = THEME_CONFIG.COLORS.electricBlue;
const darkerElectricBlue = THEME_CONFIG.COLORS.electricBlueDark;

/**
 * DevicesDonutChart
 * @param {Array} data - Array of device objects: [{ type: 'desktop', count: 1234 }, ...] or [{ type: 'mobile', percent: 45.2 }, ...]
 */
const DevicesDonutChart = ({ data, totalPageviews = 0 }) => {
  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        className="dash-card"
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
          No device data available
        </p>
      </div>
    );
  }

  // Pre-process data for RadialBarChart
  const processedData = data.map((entry, index) => {
    const deviceName = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
    const value = entry.count || entry.visitors || 0;
    return {
      name: deviceName,
      value: value,
      originalPercent: entry.percent, // Store original percent if provided
      type: entry.type,
      fill: DEVICE_COLORS[entry.type?.toLowerCase()] || DEVICE_COLORS.other
    };
  }).sort((a, b) => b.value - a.value);

  // Calculate total for domain
  const total = processedData.reduce((sum, item) => sum + item.value, 0);
  
  // If data only has percentages (no counts), we need to use totalPageviews or calculate from percents
  const hasOnlyPercents = processedData.every(item => item.value === 0 && item.originalPercent);
  const chartDomain = hasOnlyPercents ? 100 : (total > 0 ? total : 100);

  return (
    <div
      className="dash-card"
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
      {/* Accent bar at top */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px', 
        backgroundColor: darkElectricBlue,
        transition: 'height 0.3s ease'
      }} className="accent-bar" />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          marginTop: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: darkElectricBlue + '20',
              border: `2px solid ${darkElectricBlue}40`,
              transition: 'all 0.3s ease'
            }}
            className="icon-container"
          >
            <Monitor size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
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
              Device Distribution
            </h3>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '13px',
              color: THEME_CONFIG.COLORS.textSecondary,
              margin: 0
            }}>
              Platform Breakdown
            </p>
          </div>
        </div>
        <div style={{
          backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '20px',
            fontWeight: 700,
            color: darkElectricBlue,
            margin: 0,
            textShadow: `0 0 10px ${darkElectricBlue}44`
          }}>
            {processedData.length}
          </p>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '11px',
            color: THEME_CONFIG.COLORS.textMuted,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Device Types
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="40%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            barSize={12}
            data={hasOnlyPercents ? data.map(e => ({
              ...processedData.find(p => p.type === e.type),
              value: e.percent
            })) : processedData}
            startAngle={180}
            endAngle={-180}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, chartDomain]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.03)' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
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
              cursor={{ stroke: darkElectricBlue, strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value, name, props) => {
                const percentage = hasOnlyPercents 
                  ? value.toFixed(1) 
                  : ((value / total) * 100).toFixed(1);
                const visits = hasOnlyPercents 
                  ? '' 
                  : ` (${value.toLocaleString()} visits)`;
                return [`${percentage}%${visits}`, props.payload.name];
              }}
            />
            <Legend
              iconSize={10}
              iconType="square"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.8rem',
                lineHeight: '20px',
                paddingLeft: '20px'
              }}
              formatter={(value) => (
                <span style={{ color: THEME_CONFIG.COLORS.textSecondary, letterSpacing: '0.5px' }}>
                  {value}
                </span>
              )}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.15)',
          border: `1px solid ${darkElectricBlue}15`
        }}>
          <Monitor size={14} style={{ color: darkElectricBlue, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
};

export default DevicesDonutChart;
