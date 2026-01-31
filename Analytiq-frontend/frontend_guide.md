# Analytiq Backend API - Frontend Developer Guide

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Site Management](#site-management)
4. [Analytics Data Ingestion](#analytics-data-ingestion)
5. [Reports & Dashboards](#reports--dashboards)
6. [Analytics Client Integration](#analytics-client-integration)
7. [Error Handling](#error-handling)
8. [Sample Responses](#sample-responses)

## Overview

Analytiq is a comprehensive web analytics platform providing real-time visitor tracking, performance monitoring, and business intelligence. The backend API is built with FastAPI and provides both REST endpoints and specialized analytics ingestion endpoints.

**Base URL:** Configured via `BACKEND_URL` environment variable (default: `https://analytiq-gxhmhbdkc0ama3fn.centralindia-01.azurewebsites.net` for development)

## Authentication

The authentication system uses JWT (JSON Web Tokens) with a 24-hour expiration time. The authentication flow is designed for robust session management with automatic token refresh capabilities.

### Authentication Flow Overview

1. **User Registration/Login** → Receive JWT token
2. **Token Storage** → Store securely in localStorage/sessionStorage
3. **Session Validation** → Validate token on app initialization
4. **Automatic Refresh** → Refresh token before expiration
5. **Graceful Logout** → Handle token expiration and cleanup

### Key Features

- **24-hour token expiration** for enhanced security
- **Automatic token refresh** to maintain sessions
- **Session persistence** across browser reloads
- **Secure token validation** endpoint
- **Comprehensive error handling** for auth failures

### POST `/api/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "created_at": "2025-09-20T10:30:00"
}
```

### POST `/api/login`
Authenticate and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-string",
  "token_type": "bearer"
}
```

**Usage:** Include in subsequent requests as `Authorization: Bearer <token>`

### GET `/api/validate`
Validate if the current token is still valid.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com"
  },
  "expires_at": 1696089600
}
```

### POST `/api/refresh`
Refresh an existing token to extend the session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "access_token": "new-jwt-token-string",
  "token_type": "bearer"
}
```

## Site Management

### GET `/api/sites`
List all sites for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "site_id": "uuid-string",
    "owner_user_id": "uuid-string",
    "name": "My Website",
    "url": "https://mywebsite.com",
    "site_key": "secure-key-string",
    "created_at": "2025-09-20T10:30:00",
    "timezone": "UTC"
  }
]
```

### POST `/api/sites`
Create a new site for analytics tracking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Website",
  "url": "https://mywebsite.com",
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "site_id": "uuid-string",
  "owner_user_id": "uuid-string",
  "name": "My Website",
  "url": "https://mywebsite.com",
  "site_key": "secure-key-string",
  "created_at": "2025-09-20T10:30:00",
  "timezone": "America/New_York",
  "snippet": "<script async src=\"https://your-domain.com/analytics-client.js\"></script>\n<script>\n  window.analytiqSiteId = \"uuid-string\";\n  window.analytiqSiteKey = \"secure-key-string\";\n</script>"
}
```

### DELETE `/api/sites/{site_id}`
Delete a site and all its analytics data.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "deleted",
  "message": "Site uuid-string and all related data have been permanently deleted"
}
```


## Reports & Dashboards

### GET `/api/sites/{site_id}/dashboard`
Get real-time dashboard data (last 7 days).

**Headers:** `Authorization: Bearer <token>`

**Response:** See [Dashboard Response](#dashboard-response-sample) below.

### GET `/api/sites/{site_id}/report`
Get comprehensive analytics report.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD format, defaults to 30 days ago
- `end_date` (optional): YYYY-MM-DD format, defaults to today

**Example:** `/api/sites/uuid-string/report?start_date=2025-09-01&end_date=2025-09-20`

**Response:** See [Comprehensive Report Response](#comprehensive-report-response-sample) below.

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Authentication Errors
```json
{
  "detail": "Invalid credentials"
}
```

### Token Validation Errors
```json
{
  "detail": "Invalid or expired token"
}
```

### Session Management Errors
```json
{
  "detail": "User not found"
}
```

### Validation Errors
```json
{
  "detail": "Invalid date format. Use YYYY-MM-DD"
}
```

## Sample Responses

### Dashboard Response Sample
```json
{
  "website_name": "My Website",
  "url": "https://mywebsite.com",
  "site_id": "uuid-string",
  "report_generated_at": "2025-09-20T10:30:00Z",
  "date_range": "2025-09-13 to 2025-09-20",
  "total_visitors": 1250,
  "unique_visitors": 1100,
  "total_pageviews": 3500,
  "avg_time_spent_on_site_sec": 180,
  "bounce_rate_percent": 35.2,
  "traffic_sources": [
    {"source": "organic", "visitors": 500, "percent": 45.5},
    {"source": "direct", "visitors": 300, "percent": 27.3},
    {"source": "referral", "visitors": 200, "percent": 18.2},
    {"source": "social", "visitors": 100, "percent": 9.0}
  ],
  "devices": [
    {"type": "desktop", "percent": 65.0},
    {"type": "mobile", "percent": 30.0},
    {"type": "tablet", "percent": 5.0}
  ],
  "operating_systems": [
    {"name": "Windows", "percent": 45.0},
    {"name": "macOS", "percent": 25.0},
    {"name": "Android", "percent": 20.0},
    {"name": "iOS", "percent": 10.0}
  ],
  "browsers": [
    {"name": "Chrome", "percent": 60.0},
    {"name": "Safari", "percent": 20.0},
    {"name": "Firefox", "percent": 10.0},
    {"name": "Edge", "percent": 10.0}
  ],
  "performance_metrics": {
    "first_contentful_paint_avg_ms": 880,
    "largest_contentful_paint_avg_ms": 1650,
    "cumulative_layout_shift_avg": 0.06,
    "first_input_delay_avg_ms": 31,
    "server_response_time_avg_ms": 420,
    "cdn_cache_hit_ratio_percent": 87.2
  },
  "engagement_summary": {
    "avg_scroll_depth_percent": 79.2,
    "avg_clicks_per_session": 5.8,
    "avg_idle_time_sec": 12.4,
    "avg_form_interactions": 0.45,
    "avg_video_watch_time_sec": 32.8
  }
}
```

### Comprehensive Report Response Sample
```json
{
  "website_name": "Example Store",
  "url": "https://example.com",
  "report_generated_at": "2025-09-20T12:30:00Z",
  "date_range": "2025-09-01 to 2025-09-20",
  "total_visitors": 48239,
  "unique_visitors": 41210,
  "total_pageviews": 162845,
  "total_pages": 42,
  "avg_time_spent_on_site_sec": 186,
  "avg_loading_time_ms": 1720,
  "bounce_rate_percent": 38.4,
  "new_vs_returning": {
    "new_percent": 72.5,
    "returning_percent": 27.5
  },
  "traffic_sources": [
    {"source": "organic", "visitors": 21893, "percent": 45.4},
    {"source": "direct", "visitors": 10210, "percent": 21.2},
    {"source": "referral", "visitors": 7562, "percent": 15.7},
    {"source": "social", "visitors": 6574, "percent": 13.6},
    {"source": "paid", "visitors": 2000, "percent": 4.1}
  ],
  "utm_campaigns": [
    {"campaign": "fall_launch", "clicks": 3210, "conversions": 410},
    {"campaign": "newsletter_promo", "clicks": 850, "conversions": 95}
  ],
  "devices": [
    {"type": "desktop", "percent": 61.3, "avg_screen_res": "1920x1080"},
    {"type": "mobile", "percent": 34.2, "avg_screen_res": "375x812"},
    {"type": "tablet", "percent": 4.5, "avg_screen_res": "768x1024"}
  ],
  "operating_systems": [
    {"name": "Windows", "percent": 52.4},
    {"name": "macOS", "percent": 22.8},
    {"name": "Android", "percent": 12.5},
    {"name": "iOS", "percent": 4.0},
    {"name": "Linux", "percent": 8.3}
  ],
  "browsers": [
    {"name": "Chrome", "percent": 64.2},
    {"name": "Safari", "percent": 19.7},
    {"name": "Firefox", "percent": 7.8},
    {"name": "Edge", "percent": 6.3},
    {"name": "Other", "percent": 2.0}
  ],
  "pages": [
    {
      "page_title": "Homepage",
      "path": "/",
      "avg_time_spent_sec": 142,
      "avg_load_time_ms": 950,
      "views": 51230,
      "unique_visitors": 44120,
      "bounce_rate_percent": 42.1,
      "exit_rate_percent": 35.0,
      "avg_scroll_depth_percent": 74.3,
      "avg_clicks_per_visit": 3.2,
      "links_clicked_most": [
        {"href": "/products", "clicks": 8200},
        {"href": "/about", "clicks": 3200}
      ],
      "top_referrers": [
        {"referrer": "google.com", "views": 19200},
        {"referrer": "facebook.com", "views": 4000}
      ]
    },
    {
      "page_title": "Product Page",
      "path": "/products/widget-123",
      "avg_time_spent_sec": 198,
      "avg_load_time_ms": 1400,
      "views": 23810,
      "unique_visitors": 19420,
      "bounce_rate_percent": 33.2,
      "exit_rate_percent": 29.4,
      "avg_scroll_depth_percent": 86.9,
      "avg_clicks_per_visit": 4.5,
      "links_clicked_most": [
        {"href": "/cart", "clicks": 5200},
        {"href": "/reviews/widget-123", "clicks": 3300}
      ],
      "top_referrers": [
        {"referrer": "google.com", "views": 8100},
        {"referrer": "example.com/home", "views": 5200}
      ]
    }
  ],
  "geo_distribution": [
    {"country": "India", "percent": 42.5},
    {"country": "United States", "percent": 28.1},
    {"country": "United Kingdom", "percent": 10.3},
    {"country": "Germany", "percent": 7.8},
    {"country": "Other", "percent": 11.3}
  ],
  "last_24h_visitors_geo": [
    {"lat": 29.866, "long": 77.891},
    {"lat": 37.7749, "long": -122.4194},
    {"lat": 51.5074, "long": -0.1278},
    {"lat": 48.8566, "long": 2.3522}
  ],
  "engagement_summary": {
    "avg_scroll_depth_percent": 79.2,
    "avg_clicks_per_session": 5.8,
    "avg_idle_time_sec": 12.4,
    "avg_form_interactions": 0.45,
    "avg_video_watch_time_sec": 32.8
  },
  "performance_metrics": {
    "first_contentful_paint_avg_ms": 880,
    "largest_contentful_paint_avg_ms": 1650,
    "cumulative_layout_shift_avg": 0.06,
    "first_input_delay_avg_ms": 31,
    "server_response_time_avg_ms": 420,
    "cdn_cache_hit_ratio_percent": 87.2
  },
  "search_terms": [
    {"term": "widget 123", "count": 4200},
    {"term": "example store coupons", "count": 1800}
  ],
  "events_summary": [
    {"event": "rating_submitted", "count": 980},
    {"event": "newsletter_signup", "count": 1450},
    {"event": "recommendation_click", "count": 3220}
  ],
  "technology": {
    "avg_downlink_mbps": 38.5,
    "avg_rtt_ms": 42,
    "common_screen_resolutions": [
      {"resolution": "1920x1080", "percent": 48.2},
      {"resolution": "1366x768", "percent": 22.5},
      {"resolution": "375x812", "percent": 16.4}
    ]
  },
  "user_behavior": {
    "avg_sessions_per_user": 1.4,
    "avg_pages_per_session": 3.8,
    "avg_session_duration_sec": 186,
    "peak_visit_hour": "20:00-21:00",
    "days_with_highest_traffic": ["Monday", "Wednesday"]
  },
  "time_series_data": {
    "hourly_visitors": {
      "00": {"hour": "00", "average_visitors": 45.2, "total_visitors": 1020},
      "01": {"hour": "01", "average_visitors": 38.7, "total_visitors": 890},
      "09": {"hour": "09", "average_visitors": 125.3, "total_visitors": 2850}
    },
    "visitor_journey_analysis": {
      "common_entry_pages": [
        {"page": "/", "visitors": 15200},
        {"page": "/products", "visitors": 8500}
      ],
      "common_exit_pages": [
        {"page": "/checkout", "visitors": 3200},
        {"page": "/contact", "visitors": 2100}
      ]
    },
    "interaction_heatmap": {
      "click_data": {
        "/": {"120,450": 250, "200,300": 180},
        "/products": {"300,200": 320, "150,600": 290}
      },
      "scroll_analysis": {
        "/": {"avg_scroll_depth": 74.3, "max_scroll_depth": 100},
        "/products": {"avg_scroll_depth": 86.9, "max_scroll_depth": 100}
      }
    }
  },
  "custom_segments": [
    {
      "segment_name": "High Spenders",
      "criteria": "Purchases > $500",
      "visitors": 320,
      "avg_order_value": 650
    },
    {
      "segment_name": "Cart Abandoners",
      "criteria": "Added to cart but no purchase",
      "visitors": 2740,
      "recovered_percent": 18.4
    }
  ]
}
```


## Best Practices

1. **Authentication**: Always include the Bearer token for protected endpoints
2. **Rate Limiting**: Batch analytics events when possible using `/ingest/batch`
3. **Error Handling**: Check HTTP status codes and handle errors gracefully
4. **Data Validation**: Ensure timestamps are in ISO 8601 format
5. **Performance**: Use specialized endpoints (`/ingest/conversion`, `/ingest/performance`, etc.) for better data organization
6. **Security**: Never expose site keys in client-side code in production
7. **Configuration**: Use environment variables for deployment-specific settings
8. **Token Management**: Implement proper token storage and refresh mechanisms

## Token Management for Frontend Applications

To properly handle authentication sessions that persist across page reloads, implement the following comprehensive pattern in your frontend:

### 1. Token Storage and Management

```javascript
class AuthManager {
  constructor() {
    this.tokenKey = 'analytiq_token';
    this.userKey = 'analytiq_user';
    this.baseURL = 'https://analytiq-gxhmhbdkc0ama3fn.centralindia-01.azurewebsites.net'; // Use environment variable in production
  }

  // Store authentication data
  setAuth(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get stored user data
  getUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!this.getToken();
  }
}

const authManager = new AuthManager();
```

### 2. API Client with Automatic Token Handling

```javascript
// Create API client with automatic token injection
const apiClient = axios.create({
  baseURL: authManager.baseURL,
  timeout: 10000,
});

// Request interceptor - automatically add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${authManager.baseURL}/api/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authManager.getToken()}`
            }
          }
        );

        const newToken = refreshResponse.data.access_token;
        authManager.setAuth(newToken, authManager.getUser());

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(originalRequest);

      } catch (refreshError) {
        // Refresh failed, logout user
        console.error('Token refresh failed:', refreshError);
        authManager.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 3. Session Validation and App Initialization

```javascript
// Comprehensive session validation
async function validateSession() {
  const token = authManager.getToken();
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return false;
  }

  try {
    // Validate token with backend
    const response = await apiClient.get('/api/validate');
    
    // Update user data if validation successful
    if (response.data.valid && response.data.user) {
      authManager.setAuth(token, response.data.user);
      return response.data;
    }
    
    throw new Error('Invalid token response');

  } catch (error) {
    console.error('Session validation failed:', error);
    authManager.clearAuth();
    return false;
  }
}

// App initialization with proper session handling
async function initializeApp() {
  // Show loading state
  showLoadingSpinner();

  const sessionData = await validateSession();
  
  if (sessionData) {
    // User is authenticated
    console.log('User authenticated:', sessionData.user);
    hideLoadingSpinner();
    
    // Initialize authenticated app state
    initializeDashboard(sessionData.user);
    
    // Set up automatic token refresh
    setupTokenRefresh();
    
  } else {
    // User not authenticated
    console.log('User not authenticated, redirecting to login');
    hideLoadingSpinner();
    redirectToLogin();
  }
}

// Helper functions
function showLoadingSpinner() {
  // Show your loading UI
  document.getElementById('loading')?.classList.remove('hidden');
}

function hideLoadingSpinner() {
  // Hide your loading UI
  document.getElementById('loading')?.classList.add('hidden');
}

function redirectToLogin() {
  // Redirect to login page
  window.location.href = '/login';
}

// Call on DOM ready or app start
document.addEventListener('DOMContentLoaded', initializeApp);
```

### 4. Automatic Token Refresh System

```javascript
let refreshTimer = null;

function setupTokenRefresh() {
  // Clear existing timer
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // Refresh token every 20 hours (4 hours before 24h expiration)
  const refreshInterval = 20 * 60 * 60 * 1000; // 20 hours in milliseconds
  
  refreshTimer = setInterval(async () => {
    await refreshTokenIfNeeded();
  }, refreshInterval);

  console.log('Token refresh system initialized');
}

async function refreshTokenIfNeeded() {
  const token = authManager.getToken();
  
  if (!token) {
    console.log('No token to refresh');
    return false;
  }

  try {
    console.log('Refreshing token...');
    const response = await apiClient.post('/api/refresh');
    
    if (response.data.access_token) {
      authManager.setAuth(response.data.access_token, authManager.getUser());
      console.log('Token refreshed successfully');
      return true;
    }
    
    throw new Error('No token in refresh response');

  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // If refresh fails, validate current session
    const validSession = await validateSession();
    if (!validSession) {
      authManager.clearAuth();
      redirectToLogin();
    }
    
    return false;
  }
}

// Manual token refresh (can be called on user action)
async function manualTokenRefresh() {
  const success = await refreshTokenIfNeeded();
  if (success) {
    console.log('Manual token refresh successful');
  }
  return success;
}

// Cleanup on logout
function cleanupTokenRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
```

### 5. Authentication Actions (Login, Signup, Logout)

```javascript
// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${authManager.baseURL}/api/login`, {
      email,
      password
    });

    if (response.data.access_token) {
      // Store token and get user info
      const token = response.data.access_token;
      
      // Validate token to get user info
      const userResponse = await axios.get(`${authManager.baseURL}/api/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (userResponse.data.valid && userResponse.data.user) {
        authManager.setAuth(token, userResponse.data.user);
        setupTokenRefresh();
        return { success: true, user: userResponse.data.user };
      }
    }

    throw new Error('Invalid login response');

  } catch (error) {
    console.error('Login failed:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Login failed' 
    };
  }
}

// Signup function
async function signup(email, password) {
  try {
    const response = await axios.post(`${authManager.baseURL}/api/signup`, {
      email,
      password
    });

    if (response.data.id) {
      // Auto-login after successful signup
      return await login(email, password);
    }

    throw new Error('Invalid signup response');

  } catch (error) {
    console.error('Signup failed:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Signup failed' 
    };
  }
}

// Logout function
function logout() {
  authManager.clearAuth();
  cleanupTokenRefresh();
  
  // Clear any app state
  clearAppState();
  
  // Redirect to login
  window.location.href = '/login';
}

// Clear application state
function clearAppState() {
  // Clear any cached data, reset UI state, etc.
  // This is app-specific implementation
}
```

### 6. Advanced Authentication Patterns

```javascript
// Complete authentication service class
class AuthService {
  constructor() {
    this.authManager = new AuthManager();
    this.apiClient = this.setupApiClient();
    this.callbacks = {
      onLogin: [],
      onLogout: [],
      onTokenRefresh: [],
      onSessionExpired: []
    };
  }

  setupApiClient() {
    const client = axios.create({
      baseURL: this.authManager.baseURL,
      timeout: 10000,
    });

    // Add interceptors as shown above
    return client;
  }

  // Event subscription system
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Protected route checker
  requireAuth(callback) {
    if (this.authManager.isAuthenticated()) {
      callback();
    } else {
      this.redirectToLogin();
    }
  }

  // Route guard for single-page apps
  routeGuard(route, component) {
    return this.authManager.isAuthenticated() ? component : '/login';
  }
}

// Usage example
const authService = new AuthService();

// Listen for auth events
authService.on('onLogin', (user) => {
  console.log('User logged in:', user);
  // Update UI, fetch user data, etc.
});

authService.on('onLogout', () => {
  console.log('User logged out');
  // Clean up UI, redirect, etc.
});

authService.on('onSessionExpired', () => {
  console.log('Session expired');
  // Show session expired message
});
```

### 7. React/Vue Integration Examples

#### React Hook for Authentication
```javascript
import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authService] = useState(new AuthService());

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    setLoading(true);
    const sessionData = await validateSession();
    
    if (sessionData) {
      setUser(sessionData.user);
      setupTokenRefresh();
    }
    
    setLoading(false);
  }

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### Vue Composable for Authentication
```javascript
import { ref, onMounted } from 'vue';

export function useAuth() {
  const user = ref(null);
  const loading = ref(true);
  const authService = new AuthService();

  onMounted(async () => {
    await initAuth();
  });

  async function initAuth() {
    loading.value = true;
    const sessionData = await validateSession();
    
    if (sessionData) {
      user.value = sessionData.user;
      setupTokenRefresh();
    }
    
    loading.value = false;
  }

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      user.value = result.user;
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    user.value = null;
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: () => !!user.value
  };
}
```

## Common Issues & Troubleshooting

### Authentication Endpoint 404 Errors
**Problem:** Getting 404 errors when calling auth endpoints
**Solution:** Ensure you're using the correct paths:
- ✅ `/api/login` (not `/auth/login`)
- ✅ `/api/validate` (not `/auth/validate`) 
- ✅ `/api/refresh` (not `/auth/refresh`)
- ✅ `/api/signup` (not `/auth/signup`)

**Debug Steps:**
```javascript
// Test endpoint availability
async function testEndpoints() {
  const endpoints = ['/api/login', '/api/validate', '/api/refresh', '/api/signup'];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, { method: 'OPTIONS' });
      console.log(`${endpoint}: ${response.status}`);
    } catch (error) {
      console.error(`${endpoint}: Not available`);
    }
  }
}
```

### Session Not Persisting After Reload
**Problem:** User gets logged out after page refresh
**Root Causes:**
- Token not stored in localStorage
- Token validation not called on app init
- Token expired but not refreshed

**Solution:** Implement comprehensive session management:
```javascript
// Diagnostic function
function diagnoseSessionIssues() {
  const token = authManager.getToken();
  const user = authManager.getUser();
  
  console.log('Session Diagnostic:');
  console.log('- Token exists:', !!token);
  console.log('- User data exists:', !!user);
  console.log('- Token length:', token?.length || 0);
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = new Date(payload.exp * 1000);
      const now = new Date();
      
      console.log('- Token expires:', expiry.toISOString());
      console.log('- Current time:', now.toISOString());
      console.log('- Token expired:', now > expiry);
    } catch (error) {
      console.log('- Token format invalid:', error.message);
    }
  }
}
```

### Token Refresh Failures
**Problem:** Automatic token refresh not working
**Debug Steps:**
1. Check if refresh endpoint is accessible
2. Verify token is still valid for refresh
3. Ensure refresh timer is set up correctly

```javascript
// Debug token refresh
async function debugTokenRefresh() {
  const token = authManager.getToken();
  
  if (!token) {
    console.error('No token available for refresh');
    return;
  }

  try {
    console.log('Testing token refresh...');
    const response = await axios.post(`${baseURL}/api/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Refresh successful:', !!response.data.access_token);
  } catch (error) {
    console.error('Refresh failed:', error.response?.data || error.message);
  }
}
```

### CORS and Network Issues
**Problem:** CORS errors or network failures
**Solution:** 
- Ensure backend CORS is configured correctly
- Check network connectivity
- Verify base URL configuration

```javascript
// Test network connectivity
async function testConnectivity() {
  try {
    const response = await fetch(`${baseURL}/api/sites`, {
      method: 'OPTIONS'
    });
    console.log('Server reachable:', response.ok);
  } catch (error) {
    console.error('Network error:', error.message);
  }
}
```

### BCrypt Version Warnings
**Problem:** Server logs show bcrypt version errors
**Solution:** This is handled automatically by the backend fallback system and doesn't affect functionality. The warnings can be safely ignored.

### Complete Implementation Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Analytiq Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
    <div id="loading" class="hidden">Loading...</div>
    
    <!-- Login Form -->
    <div id="loginForm" class="hidden">
        <h2>Login to Analytiq</h2>
        <form id="loginSubmit">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <div id="loginError" class="error hidden"></div>
    </div>

    <!-- Dashboard -->
    <div id="dashboard" class="hidden">
        <h2>Welcome, <span id="userEmail"></span></h2>
        <button id="logoutBtn">Logout</button>
        <button id="refreshTokenBtn">Refresh Token</button>
        
        <div id="sites"></div>
    </div>

    <script>
        // Initialize auth system
        const authManager = new AuthManager();
        const authService = new AuthService();

        // DOM elements
        const loginForm = document.getElementById('loginForm');
        const dashboard = document.getElementById('dashboard');
        const loading = document.getElementById('loading');
        const loginSubmit = document.getElementById('loginSubmit');
        const logoutBtn = document.getElementById('logoutBtn');
        const refreshTokenBtn = document.getElementById('refreshTokenBtn');

        // Event listeners
        loginSubmit.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        refreshTokenBtn.addEventListener('click', handleTokenRefresh);

        // Login handler
        async function handleLogin(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            showLoading();
            
            const result = await login(email, password);
            
            if (result.success) {
                showDashboard(result.user);
                await loadSites();
            } else {
                showError(result.error);
                showLoginForm();
            }
        }

        // Logout handler
        function handleLogout() {
            logout();
        }

        // Token refresh handler
        async function handleTokenRefresh() {
            const success = await manualTokenRefresh();
            if (success) {
                alert('Token refreshed successfully!');
            } else {
                alert('Token refresh failed');
            }
        }

        // Load user sites
        async function loadSites() {
            try {
                const response = await apiClient.get('/api/sites');
                displaySites(response.data);
            } catch (error) {
                console.error('Failed to load sites:', error);
            }
        }

        // Display sites
        function displaySites(sites) {
            const sitesDiv = document.getElementById('sites');
            sitesDiv.innerHTML = '<h3>Your Sites:</h3>';
            
            if (sites.length === 0) {
                sitesDiv.innerHTML += '<p>No sites yet. Create your first site!</p>';
                return;
            }

            sites.forEach(site => {
                const siteDiv = document.createElement('div');
                siteDiv.innerHTML = `
                    <div class="site-card">
                        <h4>${site.name}</h4>
                        <p>URL: ${site.url}</p>
                        <p>Created: ${new Date(site.created_at).toLocaleDateString()}</p>
                        <button onclick="viewSiteAnalytics('${site.site_id}')">View Analytics</button>
                    </div>
                `;
                sitesDiv.appendChild(siteDiv);
            });
        }

        // View site analytics
        async function viewSiteAnalytics(siteId) {
            try {
                const response = await apiClient.get(`/api/sites/${siteId}/dashboard`);
                console.log('Analytics data:', response.data);
                // Display analytics in your UI
            } catch (error) {
                console.error('Failed to load analytics:', error);
            }
        }

        // UI helper functions
        function showLoading() {
            hideAll();
            loading.classList.remove('hidden');
        }

        function showLoginForm() {
            hideAll();
            loginForm.classList.remove('hidden');
        }

        function showDashboard(user) {
            hideAll();
            dashboard.classList.remove('hidden');
            document.getElementById('userEmail').textContent = user.email;
        }

        function hideAll() {
            loading.classList.add('hidden');
            loginForm.classList.add('hidden');
            dashboard.classList.add('hidden');
        }

        function showError(message) {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }

        // Initialize app
        initializeApp();
    </script>

    <style>
        .hidden { display: none; }
        .error { color: red; margin: 10px 0; }
        .site-card { border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px; }
        form { margin: 20px 0; }
        input { display: block; margin: 10px 0; padding: 10px; width: 200px; }
        button { padding: 10px 15px; margin: 5px; cursor: pointer; }
    </style>
</body>
</html>
```

## Development vs Production

### Development Configuration
```javascript
// Development settings
const CONFIG = {
  baseURL: 'https://analytiq-gxhmhbdkc0ama3fn.centralindia-01.azurewebsites.net',
  tokenKey: 'analytiq_token_dev',
  refreshInterval: 20 * 60 * 60 * 1000, // 20 hours
  debug: true
};
```

### Production Configuration
```javascript
// Production settings
const CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.yoursite.com',
  tokenKey: 'analytiq_token',
  refreshInterval: 20 * 60 * 60 * 1000, // 20 hours
  debug: false,
  
  // Additional production settings
  timeout: 30000,
  retryAttempts: 3,
  enableTokenRefresh: true
};
```

### Environment-Specific Best Practices

**Development:**
- Base URL: `https://analytiq-gxhmhbdkc0ama3fn.centralindia-01.azurewebsites.net` (set via `BACKEND_URL` environment variable)
- CORS enabled for all origins
- Detailed error messages and logging
- Token stored with dev suffix to avoid conflicts

**Production:**
- Use HTTPS endpoints (set `BACKEND_URL=https://your-domain.com`)
- Configure CORS for specific domains only
- Use environment variables for all configuration
- Implement proper error logging and monitoring
- Enable security headers and CSP
- Use secure token storage practices
- Implement rate limiting on frontend
- Add error tracking (Sentry, etc.)

### Security Considerations

1. **Token Storage**: Use `httpOnly` cookies for maximum security in production
2. **HTTPS Only**: Never send tokens over HTTP in production
3. **Token Expiration**: Implement proper token rotation
4. **Error Handling**: Don't expose sensitive error details to users
5. **Rate Limiting**: Implement request throttling to prevent abuse
6. **CORS**: Configure restrictive CORS policies for production
