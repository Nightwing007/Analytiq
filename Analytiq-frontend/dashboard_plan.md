# Analytiq Dashboard Visualization Plan

This document details the comprehensive visualization strategy for the Analytiq dashboard, mapping each data point from the API response to specific chart types, graphs, tables, and interactive elements using ECharts or visx.

---

## Design Theme Compliance

All charts and visualizations will follow the established design theme:
- **Color Palette**: #FBE4D6 (text/borders), #0C0950 (background), #261FB3/#161179 (elements)
- **Style**: Solid colors, thick borders, minimal border radius
- **Animations**: Interactive loading and hover animations
- **No shadows or neon effects**

---

## Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER METRICS ROW                      │
│  [Total Visitors] [Unique Visitors] [Pageviews] [Bounce]   │
├─────────────────────────────────────────────────────────────┤
│             TIME SERIES VISUALIZATION                      │
│                   [Visitors Chart]                         │
├─────────────────────────────────────────────────────────────┤
│  [Traffic Sources] │ [Device Types] │ [Geographic Map]     │
├─────────────────────────────────────────────────────────────┤
│  [Performance]     │ [Engagement]   │ [User Behavior]      │
├─────────────────────────────────────────────────────────────┤
│              PAGE ANALYTICS TABLE                          │
├─────────────────────────────────────────────────────────────┤
│  [OS & Browsers]   │ [UTM Campaigns] │ [Custom Segments]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Header Metrics Cards (KPI Dashboard)

### Data Points:
- `total_visitors`, `unique_visitors`, `total_pageviews`, `bounce_rate_percent`
- `avg_time_spent_on_site_sec`, `avg_loading_time_ms`

### Visualization:
- **Component**: Large metric cards with trend indicators
- **Chart Type**: Small sparkline charts (ECharts Line series)
- **Features**:
  - Large number display
  - Percentage change from previous period (if available)
  - Mini trend line showing last 7 days
  - Color-coded positive/negative indicators

```javascript
// Example structure
const headerMetrics = [
  {
    title: "Total Visitors",
    value: "48,239",
    change: "+12.5%",
    trend: "up",
    sparklineData: [120, 132, 101, 134, 90, 230, 210]
  }
]
```

---

## 2. Time Series Visualization

### Data Points:
- `time_series_data.hourly_visitors`
- `time_series_data.visitor_journey_analysis`

### Visualization:
- **Chart Type**: ECharts Line Chart with Area Fill
- **Features**:
  - Interactive time range selector (24h, 7d, 30d, custom)
  - Zoom and pan capabilities
  - Tooltip showing exact values
  - Multiple metrics overlay (visitors, pageviews, sessions)
  - Real-time updates via WebSocket

```javascript
// ECharts configuration
const timeSeriesConfig = {
  type: 'line',
  smooth: true,
  areaStyle: { opacity: 0.3 },
  itemStyle: { color: '#261FB3' },
  lineStyle: { width: 3 }
}
```

---

## 3. Traffic Sources Analysis

### Data Points:
- `traffic_sources[]` - source, visitors, percent
- `utm_campaigns[]` - campaign, clicks, conversions

### Visualization:
- **Primary Chart**: ECharts Pie Chart (Donut style)
- **Secondary Chart**: Horizontal Bar Chart for detailed breakdown
- **Features**:
  - Interactive legend
  - Drill-down to UTM campaign details
  - Hover animations
  - Percentage and absolute value display

```javascript
// Traffic sources pie chart
const trafficSourcesConfig = {
  type: 'pie',
  radius: ['40%', '70%'], // Donut style
  label: { 
    show: true,
    formatter: '{b}: {d}%'
  },
  emphasis: {
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
}
```

---

## 4. Device & Technology Analytics

### Data Points:
- `devices[]` - type, percent, avg_screen_res
- `operating_systems[]` - name, percent
- `browsers[]` - name, percent
- `technology.common_screen_resolutions[]`

### Visualization:
- **Device Types**: ECharts Ring Chart (3 concentric rings)
- **OS Distribution**: Horizontal Stacked Bar Chart
- **Browser Share**: Pie Chart with custom icons
- **Screen Resolutions**: Bubble Chart

```javascript
// Device distribution ring chart
const deviceConfig = {
  type: 'pie',
  radius: ['20%', '40%'],
  center: ['25%', '50%'],
  roseType: 'radius' // Rose chart variation
}
```

---

## 5. Geographic Distribution

### Data Points:
- `geo_distribution[]` - country, percent
- `last_24h_visitors_geo[]` - lat, long

### Visualization:
- **Primary**: Interactive World Map (ECharts Map)
- **Secondary**: Country list with flag icons and visitor counts
- **Real-time**: Animated dots showing live visitor locations
- **Features**:
  - Choropleth coloring based on visitor density
  - Zoom and pan functionality
  - Click-to-drill-down by country
  - Real-time visitor dots with animation

```javascript
// World map configuration
const geoMapConfig = {
  type: 'map',
  map: 'world',
  roam: true, // Enable zoom and pan
  itemStyle: {
    areaColor: '#161179',
    borderColor: '#FBE4D6'
  },
  emphasis: {
    itemStyle: {
      areaColor: '#261FB3'
    }
  }
}
```

---

## 6. Performance Metrics Dashboard

### Data Points:
- `performance_metrics` - FCP, LCP, CLS, FID, server response time, CDN cache hit ratio

### Visualization:
- **Chart Type**: Gauge Charts for Core Web Vitals
- **Secondary**: Bar Chart comparing current vs. benchmark
- **Features**:
  - Color-coded performance indicators (Good/Needs Improvement/Poor)
  - Animated gauge needles
  - Performance score calculation
  - Trend indicators

```javascript
// Core Web Vitals gauge
const performanceGaugeConfig = {
  type: 'gauge',
  min: 0,
  max: 4000, // For LCP in ms
  splitNumber: 10,
  axisLine: {
    lineStyle: {
      width: 10,
      color: [
        [0.625, '#10B981'], // Good (0-2.5s)
        [0.875, '#F59E0B'], // Needs Improvement (2.5-4s)
        [1, '#EF4444']      // Poor (>4s)
      ]
    }
  }
}
```

---

## 7. User Engagement Metrics

### Data Points:
- `engagement_summary` - scroll depth, clicks per session, idle time, form interactions, video watch time
- `user_behavior` - sessions per user, pages per session, session duration

### Visualization:
- **Engagement Overview**: Radar Chart
- **Session Metrics**: Multi-metric line chart
- **Interaction Heatmap**: Custom heatmap visualization
- **Scroll Depth**: Waterfall chart

```javascript
// Engagement radar chart
const engagementRadarConfig = {
  type: 'radar',
  radar: {
    indicator: [
      { name: 'Scroll Depth', max: 100 },
      { name: 'Clicks/Session', max: 10 },
      { name: 'Form Interactions', max: 5 },
      { name: 'Video Watch Time', max: 60 },
      { name: 'Session Duration', max: 300 }
    ]
  }
}
```

---

## 8. Page Analytics Table

### Data Points:
- `pages[]` - page_title, path, views, unique_visitors, bounce_rate, avg_time_spent, etc.

### Visualization:
- **Component**: Enhanced Data Table with inline charts
- **Features**:
  - Sortable columns
  - Search and filter functionality
  - Inline sparklines for trends
  - Expandable rows for detailed metrics
  - Export functionality (CSV, PDF)

```javascript
// Page analytics table columns
const pageTableColumns = [
  { field: 'page_title', header: 'Page', sortable: true },
  { field: 'views', header: 'Views', sortable: true, chart: 'sparkline' },
  { field: 'unique_visitors', header: 'Unique Visitors', sortable: true },
  { field: 'bounce_rate_percent', header: 'Bounce Rate', sortable: true, format: 'percentage' },
  { field: 'avg_time_spent_sec', header: 'Avg Time', sortable: true, format: 'duration' }
]
```

---

## 9. Campaign Performance

### Data Points:
- `utm_campaigns[]` - campaign, clicks, conversions
- `events_summary[]` - event, count

### Visualization:
- **Campaign ROI**: Scatter plot (clicks vs conversions)
- **Event Funnel**: Funnel chart showing conversion stages
- **Campaign Comparison**: Multi-series bar chart

```javascript
// Campaign scatter plot
const campaignScatterConfig = {
  type: 'scatter',
  symbolSize: (data) => Math.sqrt(data[2]) * 5, // Size based on conversion rate
  itemStyle: {
    opacity: 0.8,
    color: '#261FB3'
  }
}
```

---

## 10. Search Terms & Events

### Data Points:
- `search_terms[]` - term, count
- `events_summary[]` - event, count

### Visualization:
- **Search Terms**: Word Cloud
- **Events**: Tree map showing event hierarchy
- **Search Trends**: Time series line chart

---

## 11. Custom Segments Analysis

### Data Points:
- `custom_segments[]` - segment_name, criteria, visitors, additional metrics

### Visualization:
- **Segment Comparison**: Multi-series bar chart
- **Segment Distribution**: Pie chart with custom colors
- **Segment Performance**: Multi-metric comparison table

---

## Implementation Components Structure

```javascript
// Dashboard component structure
components/
  charts/
    TimeSeriesChart.jsx      // Visitors over time
    TrafficSourcesPie.jsx    // Traffic sources breakdown
    GeoMap.jsx              // Geographic distribution
    PerformanceGauges.jsx   // Core Web Vitals
    DeviceRingChart.jsx     // Device type distribution
    EngagementRadar.jsx     // User engagement metrics
  tables/
    PageAnalyticsTable.jsx  // Detailed page metrics
    CampaignTable.jsx       // UTM campaign performance
  cards/
    MetricCard.jsx          // KPI display cards
    TrendCard.jsx           // Cards with trend indicators
  maps/
    WorldMap.jsx            // Interactive world map
    RealTimeVisitors.jsx    // Live visitor tracking
```

---

## Chart Library Configuration

### ECharts Setup
```javascript
// Global ECharts theme
const analytiqTheme = {
  color: ['#261FB3', '#161179', '#FBE4D6', '#0C0950'],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, sans-serif',
    color: '#FBE4D6'
  },
  grid: {
    borderColor: '#FBE4D6',
    borderWidth: 2
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#FBE4D6', width: 2 } },
    axisLabel: { color: '#FBE4D6' }
  },
  valueAxis: {
    axisLine: { lineStyle: { color: '#FBE4D6', width: 2 } },
    axisLabel: { color: '#FBE4D6' }
  }
}
```

---

## Responsive Design Considerations

### Breakpoints:
- **Desktop**: Full dashboard layout (>1200px)
- **Tablet**: 2-column layout with stacked charts (768px - 1200px)
- **Mobile**: Single column, simplified charts (<768px)

### Mobile Optimizations:
- Simplified chart types (pie charts instead of complex multi-series)
- Touch-friendly interactions
- Reduced data density
- Collapsible sections

---

## Real-time Updates Strategy

### WebSocket Integration:
- Connect to `/ws/sites/{site_id}` for real-time updates
- Update specific chart data without full re-render
- Animate new data points
- Show "live" indicators

### Update Patterns:
```javascript
// Real-time update handler
const handleWebSocketUpdate = (data) => {
  switch(data.type) {
    case 'visitor_update':
      updateVisitorCount(data.count);
      addRealTimeMapPoint(data.geo);
      break;
    case 'pageview':
      updatePageViewsChart(data.path, data.timestamp);
      break;
    case 'performance_metric':
      updatePerformanceGuages(data.metrics);
      break;
  }
}
```

---

## Performance Optimization

### Chart Rendering:
- Lazy load charts outside viewport
- Use canvas rendering for large datasets
- Implement virtual scrolling for tables
- Debounce resize events

### Data Management:
- Cache chart data in component state
- Implement data pagination for large datasets
- Use memoization for expensive calculations
- Optimize re-renders with React.memo

---

## Accessibility Features

### Chart Accessibility:
- Alt text for all charts
- Keyboard navigation support
- Screen reader compatible data tables
- High contrast mode support
- Focus indicators

### ARIA Labels:
```javascript
// Example ARIA implementation
<div 
  role="img" 
  aria-label="Traffic sources pie chart showing organic 45%, direct 21%, referral 16%"
>
  <EChartsComponent />
</div>
```

---

## Export & Sharing Features

### Export Options:
- **Charts**: PNG, SVG, PDF export
- **Tables**: CSV, Excel export
- **Reports**: Full dashboard PDF export
- **Sharing**: Shareable dashboard URLs with time ranges

### Implementation:
```javascript
// Export functionality
const exportChart = (chartRef, format) => {
  const chart = chartRef.current.getEchartsInstance();
  const dataURL = chart.getDataURL({
    type: format,
    pixelRatio: 2,
    backgroundColor: '#0C0950'
  });
  downloadFile(dataURL, `analytics-chart.${format}`);
}
```

---

## Testing Strategy

### Chart Testing:
- Visual regression tests for chart rendering
- Data accuracy validation
- Responsive behavior testing
- Accessibility testing
- Performance benchmarking

### Mock Data:
- Create comprehensive mock datasets
- Test edge cases (zero values, large numbers)
- Validate chart behavior with missing data
- Test real-time update scenarios

---

This comprehensive dashboard plan ensures that every data point from the Analytiq API is meaningfully visualized using appropriate chart types, following the established design theme, and providing an engaging, interactive user experience.