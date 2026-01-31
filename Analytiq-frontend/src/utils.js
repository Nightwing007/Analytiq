/**
 * utils.js - Utility Functions and Helpers
 */

import { VALIDATION_RULES } from './config.js';

// ===== VALIDATION UTILITIES =====

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string, strength: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
      strength: 'weak'
    };
  }

  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return { isValid: false, error: 'Password is too long', strength: 'weak' };
  }

  // Check password strength
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 'weak';
  let strengthScore = 0;

  if (hasLower) strengthScore++;
  if (hasUpper) strengthScore++;
  if (hasDigit) strengthScore++;
  if (hasSpecial) strengthScore++;
  if (password.length >= 12) strengthScore++;

  if (strengthScore >= 4) strength = 'strong';
  else if (strengthScore >= 2) strength = 'medium';

  // Basic requirements check
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      strength
    };
  }

  return { isValid: true, error: null, strength };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: null };
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}

/**
 * Validate website URL
 * @param {string} url - URL to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateSiteUrl(url) {
  if (!url) {
    return { isValid: false, error: 'Website URL is required' };
  }

  if (!VALIDATION_RULES.SITE_URL.PATTERN.test(url)) {
    return { isValid: false, error: 'Please enter a valid URL (starting with http:// or https://)' };
  }

  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Validate site name
 * @param {string} name - Site name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateSiteName(name) {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Site name is required' };
  }

  if (name.length < VALIDATION_RULES.SITE_NAME.MIN_LENGTH) {
    return { isValid: false, error: 'Site name is too short' };
  }

  if (name.length > VALIDATION_RULES.SITE_NAME.MAX_LENGTH) {
    return { isValid: false, error: 'Site name is too long' };
  }

  return { isValid: true, error: null };
}

// ===== DATE/TIME UTILITIES =====

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };

  return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Get time ago string
 * @param {Date|string} timestamp - Timestamp
 * @returns {string} Time ago string
 */
export function getTimeAgo(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return formatDate(past);
}

// ===== NUMBER FORMATTING =====

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString();
}

/**
 * Format percentage
 * @param {number} decimal - Decimal to convert to percentage
 * @param {number} digits - Decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercent(decimal, digits = 1) {
  if (typeof decimal !== 'number' || isNaN(decimal)) return '0%';
  return `${(decimal * 100).toFixed(digits)}%`;
}

/**
 * Abbreviate large numbers
 * @param {number} num - Number to abbreviate
 * @returns {string} Abbreviated number
 */
export function abbreviateNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// ===== URL UTILITIES =====

/**
 * Build URL with query parameters
 * @param {string} base - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL
 */
export function buildUrl(base, params = {}) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

/**
 * Parse query parameters from URL
 * @param {string} search - URL search string
 * @returns {Object} Parsed parameters
 */
export function parseQueryParams(search) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// ===== LOCAL STORAGE UTILITIES =====

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// ===== PERFORMANCE UTILITIES =====

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== UI UTILITIES =====

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Conditional CSS classes
 * @param {...*} classes - Class names or objects
 * @returns {string} Combined class string
 */
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

// ===== ERROR HANDLING =====

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export function handleApiError(error) {
  if (!error) return 'An unknown error occurred';
  
  if (error.message) {
    // Handle specific error messages from the backend
    if (error.message.includes('Invalid credentials')) {
      return 'Invalid email or password';
    }
    if (error.message.includes('User already exists')) {
      return 'An account with this email already exists';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please check your internet connection';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred';
}