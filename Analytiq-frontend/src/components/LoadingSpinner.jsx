/**
 * LoadingSpinner.jsx - Loading Animation Component
 */

import React from 'react';
import { THEME_CONFIG } from '../config.js';

function LoadingSpinner({ 
  size = 'md', 
  color = THEME_CONFIG.COLORS.primary, 
  text = '', 
  fullPage = false,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullPage 
    ? 'fixed inset-0 flex items-center justify-center z-50' 
    : 'flex items-center justify-center';

  const backgroundStyle = fullPage 
    ? { backgroundColor: THEME_CONFIG.COLORS.background + '90' }
    : {};

  return (
    <div className={`${containerClasses} ${className}`} style={backgroundStyle}>
      <div className="flex flex-col items-center space-y-2">
        {/* Spinner */}
        <div className="relative">
          <div 
            className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}
            style={{ 
              borderTopColor: color,
              borderRightColor: color 
            }}
          />
        </div>
        
        {/* Loading text */}
        {text && (
          <p className="text-sm font-medium" style={{ color: THEME_CONFIG.COLORS.text }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoadingSpinner;