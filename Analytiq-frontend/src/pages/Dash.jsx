/**
 * Dash.jsx - Analytics Dashboard with Proper Layout
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { THEME_CONFIG } from '../config.js';
import API from '../components/API.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

// Dashboard Components
import DashboardHeader from '../components/DashboardHeader.jsx';
import DashboardMetricCards from '../components/DashboardMetricCards.jsx';
import SummaryStatsRow from '../components/dashboardComponents/SummaryStatsRow.jsx';
import TrafficSourcesPieChart from '../components/dashboardComponents/charts/TrafficSourcesPieChart.jsx';
import DevicesDonutChart from '../components/dashboardComponents/charts/DevicesDonutChart.jsx';
import NewVsReturningGaugeChart from '../components/dashboardComponents/charts/NewVsReturningGaugeChart.jsx';
import HourlyVisitorsAreaChart from '../components/dashboardComponents/charts/HourlyVisitorsAreaChart.jsx';
import EngagementRadarChart from '../components/dashboardComponents/charts/EngagementRadarChart.jsx';
import UserBehaviorStatsCard from '../components/dashboardComponents/UserBehaviorStatsCard.jsx';
import OperatingSystemsBarChart from '../components/dashboardComponents/charts/OperatingSystemsBarChart.jsx';
import BrowsersBarChart from '../components/dashboardComponents/charts/BrowsersBarChart.jsx';
import PerformanceMetricsGauges from '../components/dashboardComponents/charts/PerformanceMetricsGauges.jsx';
import GeoDistributionMap from '../components/dashboardComponents/charts/GeoDistributionMap.jsx';
import RecentVisitorsMap from '../components/dashboardComponents/maps/RecentVisitorsMap.jsx';
import PageAnalyticsTable from '../components/dashboardComponents/tables/PageAnalyticsTable.jsx';
import CampaignPerformanceTable from '../components/dashboardComponents/tables/CampaignPerformanceTable.jsx';
import TechnologyStatsCard from '../components/dashboardComponents/TechnologyStatsCard.jsx';
import EventTimelineChart from '../components/dashboardComponents/charts/EventTimelineChart.jsx';
import VisitorJourneyFlow from '../components/dashboardComponents/charts/VisitorJourneyFlow.jsx';
import ClickScrollHeatmap from '../components/dashboardComponents/charts/ClickScrollHeatmap.jsx';
import PerformanceTimelineByPage from '../components/dashboardComponents/charts/PerformanceTimelineByPage.jsx';
import DateRangePicker from '../components/dashboardComponents/DateRangePicker.jsx';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const dashboardThemeCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    background-color: ${THEME_CONFIG.COLORS.backgroundDark};
    background-image: 
      linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    background-attachment: fixed;
  }

  /* Scanline effect */
  body::after {
    content: " ";
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
    z-index: 9999;
    background-size: 100% 4px, 3px 100%;
    pointer-events: none;
    opacity: 0.3;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes dashCardStagger {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.98);
      filter: blur(5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
      filter: blur(0px);
    }
  }

  .dashboard-container {
    animation: fadeInUp 0.6s ease-out;
    width: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 100;
  }

  .dash-card {
    animation: dashCardStagger 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    background: ${THEME_CONFIG.COLORS.backgroundElevated} !important;
    border: 1px solid ${THEME_CONFIG.COLORS.electricBlue}33 !important;
    border-radius: 4px !important;
    padding: 20px !important;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .dash-card:hover {
    border-color: ${THEME_CONFIG.COLORS.electricBlue}88 !important;
    box-shadow: 0 0 15px ${THEME_CONFIG.COLORS.electricBlue}22;
    transform: translateY(-2px);
  }

  /* Corner accents for cards */
  .dash-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-top: 2px solid ${THEME_CONFIG.COLORS.electricBlue};
    border-left: 2px solid ${THEME_CONFIG.COLORS.electricBlue};
    opacity: 0.5;
  }

  .dash-card:nth-child(1) { animation-delay: 0.05s; }
  .dash-card:nth-child(2) { animation-delay: 0.1s; }
  .dash-card:nth-child(3) { animation-delay: 0.15s; }
  .dash-card:nth-child(4) { animation-delay: 0.2s; }
  .dash-card:nth-child(5) { animation-delay: 0.25s; }
  .dash-card:nth-child(6) { animation-delay: 0.3s; }

  .dash-section-title {
    font-family: 'Orbitron', monospace;
    letter-spacing: 2px;
    color: ${THEME_CONFIG.COLORS.electricBlue};
    text-shadow: 0 0 10px ${THEME_CONFIG.COLORS.electricBlue}66;
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dash-section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, ${THEME_CONFIG.COLORS.electricBlue}44, transparent);
  }

  .dash-card-title {
    font-family: 'Orbitron', sans-serif;
    color: ${THEME_CONFIG.COLORS.textSecondary};
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .metric-value {
    font-family: 'JetBrains Mono', monospace !important;
    color: ${THEME_CONFIG.COLORS.textPrimary};
    text-shadow: 0 0 8px ${THEME_CONFIG.COLORS.electricBlue}33;
  }

  @media (max-width: 768px) {
    .dash-grid-three, .dash-grid-two, .dash-grid-geo {
      grid-template-columns: 1fr !important;
    }
  }
`;

let cssInjected = false;
const injectDashboardCSS = () => {
  if (!cssInjected && typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = dashboardThemeCSS;
    document.head.appendChild(style);
    cssInjected = true;
  }
};

function Dash() {
  const { siteId } = useParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isInitialMount = useRef(true);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Date Range State (Default to last 7 days)
  const defaultEnd = new Date().toISOString().split('T')[0];
  const defaultStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    if (siteId) {
      fetchReportData(startDate, endDate, isInitialMount.current);
      isInitialMount.current = false;
    }
    injectDashboardCSS();
  }, [siteId, startDate, endDate]);

  const fetchReportData = async (start = startDate, end = endDate, silent = true) => {
    try {
      setLoading(true);
      const reportResponse = await API.getReport(siteId, {
        start_date: start,
        end_date: end
      });
      setReportData(reportResponse);
      if (!silent) {
        toast.success('Report data loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error(`Failed to load report data: ${error.message}`);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReportData(startDate, endDate, false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
          fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        padding: '24px 16px',
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
        overflowX: 'hidden'
      }}
    >
      <div
        className="dashboard-container"
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '0'
        }}
      >

        {/* HEADER */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <DashboardHeader
            websiteName={reportData?.website_name}
            url={reportData?.url}
            dateRange={reportData?.date_range}
            lastUpdated={reportData?.report_generated_at}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            datePicker={
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onApply={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            }
          />
        </div>

        {/* METRIC CARDS */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <DashboardMetricCards
            totalVisitors={reportData?.total_visitors}
            totalPageviews={reportData?.total_pageviews}
            avgTimeOnSiteSec={reportData?.avg_time_spent_on_site_sec}
            bounceRatePercent={reportData?.bounce_rate_percent}
          />
        </div>

        {/* SUMMARY STATS (moved to top) */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <SummaryStatsRow
            totalPages={reportData?.total_pages}
            avgLoadingTimeMs={reportData?.avg_loading_time_ms}
            uniqueVisitors={reportData?.unique_visitors}
          />
        </div>

        {/* QUICK INSIGHTS - 3 Columns */}
        <div
          className="dash-grid-three"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '24px',
            width: '100%'
          }}
        >
          <TrafficSourcesPieChart data={reportData?.traffic_sources} />
          <DevicesDonutChart data={reportData?.devices} />
          <NewVsReturningGaugeChart data={reportData?.new_vs_returning} />
        </div>

        {/* HOURLY VISITORS */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <HourlyVisitorsAreaChart data={reportData?.time_series_data?.hourly_visitors} />
        </div>

        {/* ENGAGEMENT & BEHAVIOR - 2 Columns */}
        <div
          className="dash-grid-two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px',
            width: '100%'
          }}
        >
          <EngagementRadarChart data={reportData?.engagement_summary} />
          <UserBehaviorStatsCard data={reportData?.user_behavior} />
        </div>

        {/* TECHNOLOGY BREAKDOWN - 2 Columns */}
        <div
          className="dash-grid-two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px',
            width: '100%'
          }}
        >
          <OperatingSystemsBarChart data={reportData?.operating_systems} />
          <BrowsersBarChart data={reportData?.browsers} />
        </div>

        {/* PERFORMANCE METRICS */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <PerformanceMetricsGauges data={reportData?.performance_metrics} />
        </div>

        {/* GEOGRAPHIC ANALYSIS - 1:1 Ratio (equal split) */}
        <div
          className="dash-grid-geo"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
            width: '100%'
          }}
        >
          <GeoDistributionMap data={reportData?.geo_distribution} />
          <RecentVisitorsMap data={reportData?.last_24h_visitors_geo} />
        </div>

        {/* PAGE ANALYTICS */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <PageAnalyticsTable pages={reportData?.pages} />
        </div>

        {/* CAMPAIGNS & TECHNOLOGY - 2 Columns */}
        <div
          className="dash-grid-two"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px',
            width: '100%'
          }}
        >
          <CampaignPerformanceTable data={reportData?.utm_campaigns} />
          <TechnologyStatsCard data={reportData?.technology} />
        </div>

        {/* EVENT TIMELINE */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <EventTimelineChart data={reportData?.time_series_data?.daily_timeline} />
        </div>

        {/* VISITOR JOURNEY */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <VisitorJourneyFlow data={reportData?.time_series_data?.visitor_journey_analysis} />
        </div>

        {/* HEATMAP */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <ClickScrollHeatmap data={reportData?.time_series_data?.interaction_heatmap} />
        </div>

        {/* PERFORMANCE TIMELINE */}
        <div style={{ marginBottom: '24px', width: '100%' }}>
          <PerformanceTimelineByPage data={reportData?.time_series_data?.performance_timeline} />
        </div>

        {/* SUMMARY STATS moved to top above */}

      </div>
    </div>
  );
}

export default Dash;
