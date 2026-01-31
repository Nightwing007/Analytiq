/**
 * config.js - Application Configuration
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Centralized configuration management
 * - Environment-specific settings
 * - API endpoints and URLs
 * - Feature flags and toggles
 * - Build-time and runtime configuration
 */

// Environment variables with defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://analytiq-gxhmhbdkc0ama3fn.centralindia-01.azurewebsites.net';
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WS_URL: WS_URL,
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    SIGNUP: '/api/signup',
    LOGIN: '/api/login',
    VALIDATE: '/api/validate',
    REFRESH: '/api/refresh',

    // Site Management
    SITES: '/api/sites',
    SITE_BY_ID: (siteId) => `/api/sites/${siteId}`,
    DELETE_SITE: (siteId) => `/api/sites/${siteId}`,

    // Analytics
    DASHBOARD: (siteId) => `/api/sites/${siteId}/dashboard`,
    REPORT: (siteId) => `/api/sites/${siteId}/report`,
    TIMESERIES: (siteId) => `/api/sites/${siteId}/timeseries`,
    TOP_PAGES: (siteId) => `/api/sites/${siteId}/top-pages`,

    // WebSocket
    WS_SITE: (siteId) => `/ws/sites/${siteId}`,

    // AI
    AI_CHAT_WEBSITE: '/ai/chat/website',
    AI_CHAT_METRIC: '/ai/chat/metric'
  }
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'analytiq_token',
  USER_KEY: 'analytiq_user',
  REFRESH_TOKEN_KEY: 'analytiq_refresh_token',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes buffer for token refresh
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
};

// Theme and Design Configuration - Dark Electric Blue Tech
export const THEME_CONFIG = {
  COLORS: {
    // Primary Backgrounds
    backgroundDark: '#0A0A0F',
    backgroundSecondary: '#121218',
    backgroundElevated: '#1A1A24',

    // Electric Blue Accents
    electricBlue: '#00D4FF',
    electricBlueSecondary: '#0099CC',
    electricBlueDark: '#006B99',
    electricBlueLight: '#33DDFF',

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B8BCC8',
    textMuted: '#6B7280',
    textElectric: '#00D4FF',

    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Border Colors
    borderPrimary: '#2A2A35',
    borderSecondary: '#1F1F28',
    borderElectric: '#00D4FF',

    // Legacy aliases for backward compatibility
    primary: '#00D4FF',
    primaryDark: '#006B99',
    background: '#0A0A0F',
    text: '#FFFFFF',
    white: '#FFFFFF'
  },

  BREAKPOINTS: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },

  SPACING: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },

  BORDER_RADIUS: {
    small: '6px',
    medium: '8px',
    large: '12px',
    xlarge: '16px'
  },

  ANIMATIONS: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: 'ease-in-out'
  },

  TYPOGRAPHY: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monospace: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace"
    },
    fontSize: {
      display: '3rem',
      h1: '2.25rem',
      h2: '1.875rem',
      h3: '1.5rem',
      h4: '1.25rem',
      bodyLarge: '1.125rem',
      body: '1rem',
      bodySmall: '0.875rem',
      caption: '0.75rem'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
};

// UI Configuration
export const UI_CONFIG = {
  DEFAULT_TIME_RANGE: import.meta.env.VITE_DEFAULT_TIME_RANGE || '7d',
  CHART_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_CHART_REFRESH_INTERVAL || '30000'),
  PAGINATION_SIZE: parseInt(import.meta.env.VITE_PAGINATION_SIZE || '20'),
  TOAST_DURATION: 5000
};

// WebSocket Configuration
export const WS_CONFIG = {
  MAX_RETRIES: parseInt(import.meta.env.VITE_WS_RETRY_MAX || '10'),
  RETRY_INTERVAL: parseInt(import.meta.env.VITE_WS_RETRY_INTERVAL || '1000'),
  MAX_RETRY_INTERVAL: 30000,
  HEARTBEAT_INTERVAL: 30000
};

// Feature Flags
export const FEATURES = {
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true' || NODE_ENV === 'development',
  REAL_TIME: import.meta.env.VITE_ENABLE_REAL_TIME !== 'false',
  BETA_FEATURES: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // At least one lowercase, uppercase, and digit
    MAX_LENGTH: 128
  },
  SITE_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  },
  SITE_URL: {
    PATTERN: /^https?:\/\/.+/
  }
};

// Export default config object
export default {
  API_CONFIG,
  AUTH_CONFIG,
  THEME_CONFIG,
  UI_CONFIG,
  WS_CONFIG,
  FEATURES,
  VALIDATION_RULES
};