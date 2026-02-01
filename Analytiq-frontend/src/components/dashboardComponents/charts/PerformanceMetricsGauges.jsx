import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Gauge, Zap, Activity, Minimize2, MousePointer, Server, Database, AlertCircle } from 'lucide-react';
import { THEME_CONFIG } from '../../config.js';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

/**
 * Calculate performance score (0-100) based on metrics
 * Lower is better for most metrics
 */
const calculatePerformanceScore = (data) => {
  if (!data) return 0;

  const scores = [];

  const linearScore = (value, best, worst, higherIsBetter) => {
    if (value === null || value === undefined) return null;
    var clamped;
    if (higherIsBetter) {
      if (value <= worst) clamped = 0;
      else if (value >= best) clamped = 100;
      else clamped = ((value - worst) / (best - worst)) * 100;
    } else {
      if (value <= best) clamped = 100;
      else if (value >= worst) clamped = 0;
      else clamped = ((worst - value) / (worst - best)) * 100;
    }
    return Math.max(0, Math.min(100, clamped));
  };

  // FCP: < 1800ms = 100, > 3000ms = 0 (lower is better)
  const fcpScore = linearScore(data.first_contentful_paint_avg_ms, 1800, 3000, false);
  if (fcpScore !== null) scores.push(fcpScore);

  // LCP: < 2500ms = 100, > 4000ms = 0 (lower is better)
  const lcpScore = linearScore(data.largest_contentful_paint_avg_ms, 2500, 4000, false);
  if (lcpScore !== null) scores.push(lcpScore);

  // CLS: < 0.1 = 100, > 0.25 = 0 (lower is better)
  const clsScore = linearScore(data.cumulative_layout_shift_avg, 0.1, 0.25, false);
  if (clsScore !== null) scores.push(clsScore);

  // FID: < 100ms = 100, > 300ms = 0 (lower is better)
  const fidScore = linearScore(data.first_input_delay_avg_ms, 100, 300, false);
  if (fidScore !== null) scores.push(fidScore);

  // Server RT: < 200ms = 100, > 600ms = 0 (lower is better)
  const serverScore = linearScore(data.server_response_time_avg_ms, 200, 600, false);
  if (serverScore !== null) scores.push(serverScore);

  // CDN Cache: 0 = 0, 100 = 100 (higher is better)
  const cdnScore = linearScore(data.cdn_cache_hit_ratio_percent, 100, 0, true);
  if (cdnScore !== null) scores.push(cdnScore);

  // Average of all scores
  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
};

/**
 * Format performance value with proper units
 */
const formatValue = (value, unit) => {
  if (value === null || value === undefined) return '--';

  if (unit === 'ms') {
    return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
  }

  if (unit === '%') {
    return `${value.toFixed(1)}%`;
  }

  return value.toFixed(3);
};

/**
 * Individual Performance Stat Component
 */
const PerformanceStat = ({ icon: Icon, label, fullLabel, value, unit }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: THEME_CONFIG.SPACING.sm,
      border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
      transition: 'all 300ms ease',
      minHeight: '100px'
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
        backgroundColor: `${darkElectricBlue}15`,
        marginBottom: THEME_CONFIG.SPACING.xs
      }}
    >
      <Icon size={16} style={{ color: darkElectricBlue }} />
    </div>
    <div
      className="card-title"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '11px',
        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
        color: THEME_CONFIG.COLORS.textMuted,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: '4px',
        textAlign: 'center'
      }}
      title={fullLabel}
    >
      {label}
    </div>
    <div
      className="cool-title"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '1.25rem',
        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
        color: THEME_CONFIG.COLORS.textPrimary,
        letterSpacing: '0.5px',
        textShadow: `0 0 10px ${darkElectricBlue}22`,
        lineHeight: '1',
        textAlign: 'center'
      }}
    >
      {formatValue(value, unit)}
    </div>
  </div>
);

/**
 * PerformanceMetricsGauges - With Radial Chart + Stat Grid
 */
const PerformanceMetricsGauges = ({ data }) => {
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
          No performance metrics available
        </p>
      </div>
    );
  }

  const performanceScore = calculatePerformanceScore(data);

  const gaugeData = [
    { value: performanceScore },
    { value: 100 - performanceScore }
  ];

  const metrics = [
    {
      icon: Zap,
      label: 'FCP',
      fullLabel: 'First Contentful Paint',
      value: data.first_contentful_paint_avg_ms,
      unit: 'ms'
    },
    {
      icon: Activity,
      label: 'LCP',
      fullLabel: 'Largest Contentful Paint',
      value: data.largest_contentful_paint_avg_ms,
      unit: 'ms'
    },
    {
      icon: Minimize2,
      label: 'CLS',
      fullLabel: 'Cumulative Layout Shift',
      value: data.cumulative_layout_shift_avg,
      unit: ''
    },
    {
      icon: MousePointer,
      label: 'FID',
      fullLabel: 'First Input Delay',
      value: data.first_input_delay_avg_ms,
      unit: 'ms'
    },
    {
      icon: Server,
      label: 'Server RT',
      fullLabel: 'Server Response Time',
      value: data.server_response_time_avg_ms,
      unit: 'ms'
    },
    {
      icon: Database,
      label: 'CDN Cache',
      fullLabel: 'CDN Cache Hit Ratio',
      value: data.cdn_cache_hit_ratio_percent,
      unit: '%'
    }
  ];

  return (
    <div
      style={{
        border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 300ms ease',
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
          <Gauge size={22} style={{ color: darkElectricBlue }} strokeWidth={2.5} />
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
            Performance Metrics
          </h3>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '13px',
            color: THEME_CONFIG.COLORS.textSecondary,
            margin: 0
          }}>
            Core Web Vitals
          </p>
        </div>
      </div>

      {/* Radial Gauge Chart */}
      <div style={{ position: 'relative', marginBottom: THEME_CONFIG.SPACING.xl }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
            >
              <Cell fill={darkElectricBlue} stroke="none" />
              <Cell fill={THEME_CONFIG.COLORS.backgroundDark} stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score Display */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -10%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            className="cool-title"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '2.5rem',
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold,
              color: THEME_CONFIG.COLORS.textPrimary,
              letterSpacing: '1px',
              textShadow: `0 0 15px ${darkElectricBlue}22`,
              lineHeight: '1',
              marginBottom: '4px'
            }}
          >
            {Math.round(performanceScore)}
          </div>
          <div
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
            Overall Score
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: THEME_CONFIG.SPACING.sm
        }}
      >
        {metrics.map((metric, index) => (
          <PerformanceStat
            key={index}
            icon={metric.icon}
            label={metric.label}
            fullLabel={metric.fullLabel}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetricsGauges;
