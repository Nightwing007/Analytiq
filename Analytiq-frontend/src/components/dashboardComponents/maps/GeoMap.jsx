/**
 * GeoMap.jsx - Geographic Distribution Map
 * Interactive world map showing visitor distribution
 */

import React, { useState } from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { Globe, Users } from 'lucide-react';

const GeoMap = ({ 
  geoDistribution = [],
  realtimeVisitors = [],
  title = "Geographic Distribution",
  loading = false 
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showRealtime, setShowRealtime] = useState(true);

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
        <div className="flex items-center">
          <Globe size={20} style={{ color: THEME_CONFIG.COLORS.primary }} />
          <h3 
            className="text-lg font-semibold ml-2"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            {title}
          </h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showRealtime}
              onChange={(e) => setShowRealtime(e.target.checked)}
              className="mr-2"
            />
            <span 
              className="text-sm"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Real-time visitors
            </span>
          </label>
          
          {showRealtime && (
            <div 
              className="flex items-center text-sm"
              style={{ color: THEME_CONFIG.COLORS.primary }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Live: {realtimeVisitors.length} visitors
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-64 w-full">
        <div className="flex h-full">
          {/* Map Placeholder */}
          <div 
            className="flex-1 flex items-center justify-center border-2 rounded-sm mr-4"
            style={{ 
              borderColor: THEME_CONFIG.COLORS.text + '40'
            }}
          >
            <div className="text-center">
              <Globe size={48} style={{ color: THEME_CONFIG.COLORS.primary }} />
              <div 
                className="mt-2"
                style={{ color: THEME_CONFIG.COLORS.text }}
              >
                ECharts World Map
              </div>
              <div 
                className="text-sm mt-1"
                style={{ color: THEME_CONFIG.COLORS.text + '80' }}
              >
                Interactive choropleth visualization
              </div>
              {showRealtime && (
                <div 
                  className="text-xs mt-2"
                  style={{ color: THEME_CONFIG.COLORS.primary }}
                >
                  + Animated real-time visitor dots
                </div>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="w-1/3">
            <h4 
              className="text-sm font-medium mb-3"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Top Countries
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {geoDistribution.map((country, index) => (
                <div 
                  key={country.country}
                  onClick={() => setSelectedCountry(country)}
                  className="flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-opacity-20 transition-colors"
                  style={{
                    backgroundColor: selectedCountry?.country === country.country 
                      ? THEME_CONFIG.COLORS.primary + '20' 
                      : THEME_CONFIG.COLORS.context + '20',
                    borderLeft: `4px solid ${THEME_CONFIG.COLORS.primary}`
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {/* TODO: Add country flag emojis */}
                      🌍
                    </span>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {country.country}
                    </span>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-sm font-bold"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {country.percent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          <Users size={14} className="inline mr-1" />
          Total countries: {geoDistribution.length}
        </div>
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Click and drag to navigate • Scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default GeoMap;