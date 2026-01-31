/**
 * DeviceRingChart.jsx - Device Type Distribution
 * Ring chart showing desktop, mobile, tablet breakdown
 */

import React from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const DeviceRingChart = ({ 
  devices = [],
  title = "Device Distribution",
  loading = false 
}) => {
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
          className="h-48 rounded"
          style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
        ></div>
      </div>
    );
  }

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop': return <Monitor size={20} />;
      case 'mobile': return <Smartphone size={20} />;
      case 'tablet': return <Tablet size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  const getDeviceColor = (index) => {
    const colors = [THEME_CONFIG.COLORS.primary, THEME_CONFIG.COLORS.element, THEME_CONFIG.COLORS.text + '80'];
    return colors[index % colors.length];
  };

  const totalPercentage = devices.reduce((sum, device) => sum + (device.percent || 0), 0);

  return (
    <div 
      className="border-2 rounded-sm p-6"
      style={{
        borderColor: THEME_CONFIG.COLORS.text,
        backgroundColor: THEME_CONFIG.COLORS.context + '10'
      }}
    >
      {/* Header */}
      <h3 
        className="text-lg font-semibold mb-6"
        style={{ color: THEME_CONFIG.COLORS.text }}
      >
        {title}
      </h3>

      <div className="flex items-center">
        {/* Ring Chart Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer Ring Placeholder */}
            <div 
              className="w-32 h-32 rounded-full border-8 flex items-center justify-center"
              style={{ borderColor: getDeviceColor(0) + '40' }}
            >
              {/* Inner Content */}
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: THEME_CONFIG.COLORS.text }}
                >
                  {devices.length}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                >
                  Device Types
                </div>
              </div>
            </div>

            {/* Chart Type Indicator */}
            <div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs"
              style={{ color: THEME_CONFIG.COLORS.text + '60' }}
            >
              ECharts Ring Chart
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="w-1/2 ml-6">
          <h4 
            className="text-sm font-medium mb-4"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            Device Breakdown
          </h4>
          
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div 
                key={device.type}
                className="flex items-center justify-between p-3 rounded-sm"
                style={{
                  backgroundColor: getDeviceColor(index) + '20',
                  borderLeft: `4px solid ${getDeviceColor(index)}`
                }}
              >
                <div className="flex items-center">
                  <div style={{ color: getDeviceColor(index) }}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="ml-3">
                    <div 
                      className="text-sm font-medium capitalize"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {device.type}
                    </div>
                    {device.avg_screen_res && (
                      <div 
                        className="text-xs"
                        style={{ color: THEME_CONFIG.COLORS.text + '80' }}
                      >
                        Avg: {device.avg_screen_res}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: THEME_CONFIG.COLORS.text }}
                  >
                    {device.percent?.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Validation */}
          {totalPercentage !== 100 && (
            <div 
              className="mt-3 text-xs p-2 rounded-sm"
              style={{ 
                backgroundColor: '#F59E0B20',
                color: '#F59E0B'
              }}
            >
              Note: Total {totalPercentage.toFixed(1)}% (may not equal 100% due to rounding)
            </div>
          )}
        </div>
      </div>

      {/* Additional Device Information */}
      <div className="mt-6 pt-4 border-t-2" style={{ borderColor: THEME_CONFIG.COLORS.text + '40' }}>
        <div className="text-xs text-center" style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Based on user agent detection • Updated in real-time
        </div>
      </div>
    </div>
  );
};

export default DeviceRingChart;