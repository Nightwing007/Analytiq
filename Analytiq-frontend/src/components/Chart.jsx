import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { THEME_CONFIG } from '../config.js';

const Chart = ({ type, data, title, dataKey = 'value', timeKey = 'time' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-500">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={timeKey} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value, name) => [value, name]}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={THEME_CONFIG.colors.primary}
              strokeWidth={2}
              dot={{ fill: THEME_CONFIG.colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={timeKey} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value, name) => [value, name]}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={THEME_CONFIG.colors.primary}
              fill={THEME_CONFIG.colors.accent}
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      default:
        return (
          <div className="text-center text-gray-500 p-8">
            <p>Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
