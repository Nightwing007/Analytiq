/**
 * TrafficSourcesPie.jsx - Traffic Sources Breakdown Pie Chart
 * Donut pie chart with drill-down to UTM campaigns
 */

import React, { useState } from 'react';
import { THEME_CONFIG } from '../../../config.js';

const TrafficSourcesPie = ({ 
  data = [], 
  utmCampaigns = [],
  title = "Traffic Sources",
  loading = false 
}) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [showUTMDrilldown, setShowUTMDrilldown] = useState(false);

  if (loading) {
    return (
      <div 
        className="border-2 rounded-sm p-6 animate-pulse"
        style={{
          borderColor: THEME_CONFIG.COLORS.text,
          backgroundColor: THEME_CONFIG.COLORS.context + '10'
        }}
      >
        <div 
          className="h-6 rounded mb-4"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '20' }}
        ></div>
        <div 
          className="h-64 rounded"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
        ></div>
      </div>
    );
  }

  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setShowUTMDrilldown(true);
  };

  return (
    <div 
      className="border-2 rounded-sm p-6"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: THEME_CONFIG.COLORS.text }}
        >
          {title}
        </h3>
        
        {showUTMDrilldown && (
          <button
            onClick={() => setShowUTMDrilldown(false)}
            className="text-sm px-3 py-1 border-2 rounded-sm"
            style={{
              borderColor: THEME_CONFIG.COLORS.text + '40',
              color: THEME_CONFIG.COLORS.text
            }}
          >
            ← Back to Overview
          </button>
        )}
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        {!showUTMDrilldown ? (
          /* Main Traffic Sources Pie Chart */
          <div className="flex">
            {/* Chart Placeholder */}
            <div 
              className="flex-1 flex items-center justify-center border-2 rounded-sm"
              style={{ 
                borderColor: THEME_CONFIG.COLORS.text + '40'
              }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🥧</div>
                <div style={{ color: THEME_CONFIG.COLORS.text }}>
                  ECharts Donut Pie Chart
                </div>
                <div 
                  className="text-sm mt-1"
                  style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                >
                  Sources: {data.length}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="w-1/3 ml-4">
              <h4 
                className="text-sm font-medium mb-3"
                style={{ color: THEME_CONFIG.COLORS.text }}
              >
                Sources
              </h4>
              <div className="space-y-2">
                {data.map((source, index) => (
                  <div 
                    key={source.source}
                    onClick={() => handleSourceClick(source)}
                    className="flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-opacity-20 transition-colors"
                    style={{
                      backgroundColor: THEME_CONFIG.COLORS.primary + '10',
                      borderLeft: `4px solid ${THEME_CONFIG.COLORS.primary}`
                    }}
                  >
                    <span 
                      className="text-sm font-medium capitalize"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {source.source}
                    </span>
                    <div className="text-right">
                      <div 
                        className="text-sm font-bold"
                        style={{ color: THEME_CONFIG.COLORS.text }}
                      >
                        {source.percent.toFixed(1)}%
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                      >
                        {source.visitors?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* UTM Campaign Drilldown */
          <div>
            <h4 
              className="text-lg font-medium mb-4"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              {selectedSource?.source} Campaigns
            </h4>
            
            <div 
              className="border-2 rounded-sm p-4 h-48 flex items-center justify-center"
              style={{ 
                borderColor: THEME_CONFIG.COLORS.text + '40'
              }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div style={{ color: THEME_CONFIG.COLORS.text }}>
                  UTM Campaign Analysis
                </div>
                <div 
                  className="text-sm mt-1"
                  style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                >
                  Campaigns: {utmCampaigns.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficSourcesPie;