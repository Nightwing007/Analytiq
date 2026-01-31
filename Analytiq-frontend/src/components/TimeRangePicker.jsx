import React, { useState } from 'react';

import { THEME_CONFIG } from '../config.js';

const TimeRangePicker = ({ onTimeRangeChange, currentRange = '24h' }) => {
  const [selectedRange, setSelectedRange] = useState(currentRange);

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleRangeChange(range.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedRange === range.value
              ? 'text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={{
            backgroundColor: selectedRange === range.value ? THEME_CONFIG.colors.primary : undefined
          }}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangePicker;
