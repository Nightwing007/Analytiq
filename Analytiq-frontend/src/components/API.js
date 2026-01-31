/**
 * API.js - HTTP Client and Authentication Manager
 */

import { API_CONFIG, AUTH_CONFIG } from '../config.js';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  // Store token
  setToken(token) {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  }

  // Get stored user
  getUser() {
    const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Store user
  setUser(user) {
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    console.log('API: Checking authentication, token exists:', !!token);

    if (!token) {
      console.log('API: No token found');
      return false;
    }

    // Check if token is expired (basic check)
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('API: Invalid token format');
        this.removeToken();
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      console.log('API: Token expires at:', new Date(payload.exp * 1000));
      console.log('API: Current time:', new Date(currentTime * 1000));

      // Add a small buffer to prevent edge cases
      const isValid = payload.exp > (currentTime + 30); // 30 seconds buffer

      if (!isValid) {
        console.log('API: Token is expired, removing...');
        this.removeToken();
        return false;
      }

      console.log('API: Token is valid');
      return true;
    } catch (error) {
      console.error('API: Error parsing token:', error);
      // If token is corrupted, remove it
      this.removeToken();
      return false;
    }
  }

  // Validate token with backend
  async validateToken() {
    const token = this.getToken();
    console.log('API: Starting token validation with backend...');

    if (!token) {
      console.log('API: No token to validate');
      return false;
    }

    try {
      console.log('API: Sending validation request to /api/validate...');
      const response = await this.request(API_CONFIG.ENDPOINTS.VALIDATE, {
        method: 'GET'
      });

      console.log('API: Backend validation response:', response);

      if (response.valid && response.user) {
        console.log('API: Token is valid on backend');
        // Update stored user data with validated info
        this.setUser(response.user);
        return response; // Return the full validation response
      } else {
        console.log('API: Token invalid on backend, removing...');
        this.removeToken();
        return false;
      }

    } catch (error) {
      console.error('API: Error validating token with backend:', error);

      // If it's an authentication error (401), remove the token
      if (error.message && error.message.includes('401')) {
        console.log('API: Token invalid (401), removing...');
        this.removeToken();
        return false;
      }

      // If we can't reach the server, don't remove the token
      // but return false so the user needs to login again
      console.log('API: Backend unreachable, keeping token but returning false');
      return false;
    }
  }

  // Refresh authentication token
  async refreshToken() {
    const token = this.getToken();
    console.log('API: Starting token refresh...');

    if (!token) {
      console.log('API: No token to refresh');
      return false;
    }

    try {
      console.log('API: Sending refresh request to /api/refresh...');
      const response = await this.request(API_CONFIG.ENDPOINTS.REFRESH, {
        method: 'POST'
      });

      console.log('API: Token refresh response:', response);

      if (response.access_token) {
        console.log('API: Token refreshed successfully');
        this.setToken(response.access_token);
        return response;
      } else {
        console.log('API: No new token in refresh response');
        this.removeToken();
        return false;
      }

    } catch (error) {
      console.error('API: Error refreshing token:', error);

      // If refresh fails, remove the token
      console.log('API: Token refresh failed, removing token...');
      this.removeToken();
      return false;
    }
  }

  // Make HTTP request with authentication
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    console.log('API: Making request to:', url);
    console.log('API: Request options:', { ...options, body: options.body ? 'JSON data' : undefined });

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      console.log('API: Sending fetch request...');
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle different response status codes
      if (response.status === 401) {
        // Unauthorized - remove token but let AuthContext handle redirect
        console.log('API: Unauthorized response, removing token');
        this.removeToken();
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        console.log('API: Non-OK response');
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        console.log('API: Error data:', errorData);
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  // Authentication methods
  async signup(email, password) {
    const response = await this.request(API_CONFIG.ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return response;
  }

  async login(email, password) {
    console.log('API: Attempting login to:', `${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`);
    console.log('API: Login payload:', { email, password: '***' });

    try {
      const response = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('API: Login response:', response);

      if (response.access_token) {
        this.setToken(response.access_token);
        console.log('API: Token stored successfully');

        // After storing token, validate it to get user info
        const validationResult = await this.validateToken();
        if (validationResult && validationResult.user) {
          console.log('API: User data retrieved from validation');
          return {
            ...response,
            user: validationResult.user
          };
        } else {
          // If validation fails, create basic user object from email
          const basicUser = { email: email };
          this.setUser(basicUser);
          return {
            ...response,
            user: basicUser
          };
        }
      }

      return response;
    } catch (error) {
      console.error('API: Login error:', error);
      throw error;
    }
  }

  logout() {
    this.removeToken();
    // Don't automatically redirect - let the AuthContext handle navigation
  }

  // Site management methods
  async getSites() {
    return this.request(API_CONFIG.ENDPOINTS.SITES);
  }

  async createSite(siteData) {
    return this.request(API_CONFIG.ENDPOINTS.SITES, {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
  }

  async deleteSite(siteId) {
    return this.request(API_CONFIG.ENDPOINTS.DELETE_SITE(siteId), {
      method: 'DELETE',
    });
  }

  async getSite(siteId) {
    return this.request(API_CONFIG.ENDPOINTS.SITE_BY_ID(siteId));
  }

  // Analytics methods
  async getDashboard(siteId) {
    return this.request(API_CONFIG.ENDPOINTS.DASHBOARD(siteId));
  }

  async getReport(siteId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.REPORT(siteId)}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getTimeseries(siteId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.TIMESERIES(siteId)}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getTopPages(siteId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.TOP_PAGES(siteId)}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // AI Methods
  async chatWebsite(siteId, message) {
    return this.request(API_CONFIG.ENDPOINTS.AI_CHAT_WEBSITE, {
      method: 'POST',
      body: JSON.stringify({ website_id: siteId, message })
    });
  }

  async chatMetric(siteId, metric, message, page = null) {
    return this.request(API_CONFIG.ENDPOINTS.AI_CHAT_METRIC, {
      method: 'POST',
      body: JSON.stringify({ website_id: siteId, metric, message, page })
    });
  }
}

// Create and export singleton instance
const apiClient = new APIClient();

// Named exports for specific methods
export const {
  signup,
  login,
  logout,
  getSites,
  createSite,
  deleteSite,
  getSite,
  getDashboard,
  getReport,
  getTimeseries,
  getTopPages,
  isAuthenticated,
  validateToken,
  refreshToken,
  getUser,
  getToken,
  chatWebsite,
  chatMetric
} = apiClient;

// Default export
export default apiClient;
