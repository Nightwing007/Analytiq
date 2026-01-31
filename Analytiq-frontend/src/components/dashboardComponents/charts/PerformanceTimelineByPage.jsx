import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const lighterElectricBlue = '#4D94FF';

// Electric blue gradient palette for performance metrics
const PERFORMANCE_COLORS = {
  avg: '#0066FF',      // Primary electric blue - average
  fastest: '#4D94FF',  // Lighter blue - best case
  slowest: '#0052CC'   // Darker blue - worst case
};

// Prepare chart data: convert object to array
function prepareTimelineData(data) {
  if (!data || typeof data !== 'object') return [];
  return Object.entries(data).map(([page, stats]) => ({
    page,
    avg: stats.avg_load_time_ms ?? 0,
    fastest: stats.fastest_load_ms ?? 0,
    slowest: stats.slowest_load_ms ?? 0,
  }));
}

const PerformanceTimelineByPage = ({ data }) => {
  const chartData = prepareTimelineData(data);

  // Empty state
  if (!chartData.length) {
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
          No performance timeline data available
        </p>
      </div>
    );
  }

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
          <Zap size={18} style={{ color: darkElectricBlue }} />
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
          Performance Timeline by Page
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 60)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          barSize={16}
        >
          <XAxis
            type="number"
            tick={{
              fill: THEME_CONFIG.COLORS.textMuted,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 11
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            tickFormatter={(value) => `${value}ms`}
          />

          <YAxis
            type="category"
            dataKey="page"
            tick={{
              fill: THEME_CONFIG.COLORS.textSecondary,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              fontWeight: 500
            }}
            stroke={THEME_CONFIG.COLORS.borderPrimary}
            width={150}
          />

          <Tooltip
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
            itemStyle={{
              color: THEME_CONFIG.COLORS.textPrimary
            }}
            labelStyle={{
              color: THEME_CONFIG.COLORS.textPrimary,
              fontWeight: 600,
              marginBottom: '4px'
            }}
            formatter={(value) => `${value}ms`}
          />

          <Legend
            wrapperStyle={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              color: THEME_CONFIG.COLORS.textSecondary,
              paddingTop: THEME_CONFIG.SPACING.md
            }}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: THEME_CONFIG.COLORS.textSecondary }}>
                {value}
              </span>
            )}
          />

          <Bar
            dataKey="fastest"
            name="Fastest Load"
            fill={PERFORMANCE_COLORS.fastest}
            radius={[0, 6, 6, 0]}
            animationDuration={1000}
          />

          <Bar
            dataKey="avg"
            name="Average Load"
            fill={PERFORMANCE_COLORS.avg}
            radius={[0, 6, 6, 0]}
            animationDuration={1000}
          />

          <Bar
            dataKey="slowest"
            name="Slowest Load"
            fill={PERFORMANCE_COLORS.slowest}
            radius={[0, 6, 6, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Footer Info */}
      <div
        style={{
          marginTop: THEME_CONFIG.SPACING.md,
          paddingTop: THEME_CONFIG.SPACING.md,
          borderTop: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: THEME_CONFIG.SPACING.sm
        }}
      >
        <div style={{
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textMuted,
          fontFamily: "'Rajdhani', sans-serif"
        }}>
          Showing {chartData.length} page{chartData.length !== 1 ? 's' : ''}
        </div>
        <div style={{
          display: 'flex',
          gap: THEME_CONFIG.SPACING.md,
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          fontFamily: "'Rajdhani', sans-serif"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: PERFORMANCE_COLORS.fastest
            }} />
            <span style={{ color: THEME_CONFIG.COLORS.textMuted }}>
              Best case
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: PERFORMANCE_COLORS.avg
            }} />
            <span style={{ color: THEME_CONFIG.COLORS.textMuted }}>
              Typical
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: PERFORMANCE_COLORS.slowest
            }} />
            <span style={{ color: THEME_CONFIG.COLORS.textMuted }}>
              Worst case
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTimelineByPage;
