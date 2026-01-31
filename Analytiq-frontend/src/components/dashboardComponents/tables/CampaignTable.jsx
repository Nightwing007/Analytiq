/**
 * CampaignTable.jsx - UTM Campaign Performance Table
 * Table for tracking campaign clicks, conversions, and ROI
 */

import React, { useState, useMemo } from 'react';
import { THEME_CONFIG } from '../../../config.js';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  MousePointer, 
  Target, 
  TrendingUp,
  Award,
  Download
} from 'lucide-react';

const CampaignTable = ({ 
  campaigns = [],
  events = [],
  title = "Campaign Performance",
  loading = false 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'conversions', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i}
              className="h-12 rounded"
              style={{ backgroundColor: THEME_CONFIG.COLORS.text + '10' }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const calculateConversionRate = (clicks, conversions) => {
    if (!clicks || clicks === 0) return 0;
    return ((conversions / clicks) * 100).toFixed(2);
  };

  const getCampaignPerformance = (conversionRate) => {
    if (conversionRate >= 10) return { level: 'Excellent', color: '#10B981' };
    if (conversionRate >= 5) return { level: 'Good', color: '#F59E0B' };
    if (conversionRate >= 2) return { level: 'Average', color: '#6B7280' };
    return { level: 'Poor', color: '#EF4444' };
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns.filter(campaign =>
      campaign.campaign?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle calculated fields
        if (sortConfig.key === 'conversion_rate') {
          aValue = parseFloat(calculateConversionRate(a.clicks, a.conversions));
          bValue = parseFloat(calculateConversionRate(b.clicks, b.conversions));
        }

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
    }

    return filtered;
  }, [campaigns, searchTerm, sortConfig]);

  const SortableHeader = ({ sortKey, children, className = "" }) => (
    <th 
      className={`px-4 py-3 text-left cursor-pointer hover:bg-opacity-20 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
      style={{ 
        backgroundColor: THEME_CONFIG.COLORS.context + '20',
        color: THEME_CONFIG.COLORS.text,
        borderBottom: `2px solid ${THEME_CONFIG.COLORS.text}`
      }}
    >
      <div className="flex items-center">
        {children}
        <div className="ml-2">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? 
              <ChevronUp size={14} /> : 
              <ChevronDown size={14} />
          ) : (
            <div className="w-3.5 h-3.5"></div>
          )}
        </div>
      </div>
    </th>
  );

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
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: THEME_CONFIG.COLORS.text + '80' }}
            />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 rounded-sm text-sm"
              style={{
                borderColor: THEME_CONFIG.COLORS.text + '40',
                backgroundColor: THEME_CONFIG.COLORS.background,
                color: THEME_CONFIG.COLORS.text
              }}
            />
          </div>
          
          {/* Export Button */}
          <button
            className="flex items-center px-3 py-2 border-2 rounded-sm text-sm transition-colors hover:bg-opacity-20"
            style={{
              borderColor: THEME_CONFIG.COLORS.primary,
              color: THEME_CONFIG.COLORS.primary
            }}
          >
            <Download size={14} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Campaign Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="p-4 rounded-sm border-2"
          style={{
            borderColor: THEME_CONFIG.COLORS.text + '40',
            backgroundColor: THEME_CONFIG.COLORS.background + '40'
          }}
        >
          <div className="flex items-center mb-2">
            <Target size={16} style={{ color: THEME_CONFIG.COLORS.primary }} />
            <span 
              className="text-sm font-medium ml-2"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Total Campaigns
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            {campaigns.length}
          </div>
        </div>

        <div 
          className="p-4 rounded-sm border-2"
          style={{
            borderColor: THEME_CONFIG.COLORS.text + '40',
            backgroundColor: THEME_CONFIG.COLORS.background + '40'
          }}
        >
          <div className="flex items-center mb-2">
            <MousePointer size={16} style={{ color: THEME_CONFIG.COLORS.primary }} />
            <span 
              className="text-sm font-medium ml-2"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Total Clicks
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            {campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0).toLocaleString()}
          </div>
        </div>

        <div 
          className="p-4 rounded-sm border-2"
          style={{
            borderColor: THEME_CONFIG.COLORS.text + '40',
            backgroundColor: THEME_CONFIG.COLORS.background + '40'
          }}
        >
          <div className="flex items-center mb-2">
            <Award size={16} style={{ color: THEME_CONFIG.COLORS.primary }} />
            <span 
              className="text-sm font-medium ml-2"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Total Conversions
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            {campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0).toLocaleString()}
          </div>
        </div>

        <div 
          className="p-4 rounded-sm border-2"
          style={{
            borderColor: THEME_CONFIG.COLORS.text + '40',
            backgroundColor: THEME_CONFIG.COLORS.background + '40'
          }}
        >
          <div className="flex items-center mb-2">
            <TrendingUp size={16} style={{ color: THEME_CONFIG.COLORS.primary }} />
            <span 
              className="text-sm font-medium ml-2"
              style={{ color: THEME_CONFIG.COLORS.text }}
            >
              Avg Conversion Rate
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            {campaigns.length > 0 ? (
              campaigns.reduce((sum, c) => sum + parseFloat(calculateConversionRate(c.clicks, c.conversions)), 0) / campaigns.length
            ).toFixed(2) : 0}%
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <SortableHeader sortKey="campaign">Campaign Name</SortableHeader>
              <SortableHeader sortKey="clicks">
                <MousePointer size={14} className="mr-1" />
                Clicks
              </SortableHeader>
              <SortableHeader sortKey="conversions">
                <Award size={14} className="mr-1" />
                Conversions
              </SortableHeader>
              <SortableHeader sortKey="conversion_rate">
                <TrendingUp size={14} className="mr-1" />
                Conversion Rate
              </SortableHeader>
              <th 
                className="px-4 py-3 text-left"
                style={{ 
                  backgroundColor: THEME_CONFIG.COLORS.context + '20',
                  color: THEME_CONFIG.COLORS.text,
                  borderBottom: `2px solid ${THEME_CONFIG.COLORS.text}`
                }}
              >
                Performance
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCampaigns.map((campaign, index) => {
              const conversionRate = parseFloat(calculateConversionRate(campaign.clicks, campaign.conversions));
              const performance = getCampaignPerformance(conversionRate);

              return (
                <tr 
                  key={index}
                  className="hover:bg-opacity-10 transition-colors"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'transparent' : THEME_CONFIG.COLORS.background + '20',
                    borderBottom: `1px solid ${THEME_CONFIG.COLORS.text + '20'}`
                  }}
                >
                  <td className="px-4 py-3">
                    <div 
                      className="font-medium"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {campaign.campaign}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="font-bold"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {campaign.clicks?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="font-bold"
                      style={{ color: THEME_CONFIG.COLORS.text }}
                    >
                      {campaign.conversions?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="font-bold"
                      style={{ color: performance.color }}
                    >
                      {conversionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium"
                      style={{
                        backgroundColor: performance.color + '20',
                        color: performance.color
                      }}
                    >
                      {performance.level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Events Summary */}
      {events.length > 0 && (
        <div className="mt-6 pt-6 border-t-2" style={{ borderColor: THEME_CONFIG.COLORS.text + '40' }}>
          <h4 
            className="text-lg font-medium mb-4"
            style={{ color: THEME_CONFIG.COLORS.text }}
          >
            Related Events
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event, index) => (
              <div 
                key={index}
                className="p-3 rounded-sm border-2"
                style={{
                  borderColor: THEME_CONFIG.COLORS.text + '40',
                  backgroundColor: THEME_CONFIG.COLORS.background + '20'
                }}
              >
                <div className="flex justify-between items-center">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: THEME_CONFIG.COLORS.text }}
                  >
                    {event.event}
                  </span>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: THEME_CONFIG.COLORS.primary }}
                  >
                    {event.count?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Footer */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Showing {filteredAndSortedCampaigns.length} of {campaigns.length} campaigns
        </div>
        <div style={{ color: THEME_CONFIG.COLORS.text + '80' }}>
          Performance based on conversion rate thresholds
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;