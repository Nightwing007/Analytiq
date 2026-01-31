/**
 * WebsocketManager.jsx - Real-time WebSocket Connection Manager
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Establish and maintain WebSocket connection to backend
 * - Handle real-time analytics updates for dashboard
 * - Manage connection state and automatic reconnection
 * - Parse and dispatch incoming messages to components
 * - Provide connection status indicators
 * 
 * WEBSOCKET CONNECTION:
 * - Connect to: /ws/sites/{site_id}?token={dashboard_token}
 * - Authentication via JWT token or site-specific token
 * - Secure WebSocket (WSS) for production
 * - Connection pooling for multiple sites
 * 
 * MESSAGE TYPES HANDLED:
 * 1. metrics_update:
 *    - Real-time visitor count changes
 *    - New pageview notifications
 *    - Live performance metrics
 *    - Traffic source updates
 * 
 * 2. visitor_online:
 *    - Current active visitors count
 *    - Geographic distribution updates
 *    - Real-time user journey tracking
 * 
 * 3. system_status:
 *    - Server health notifications
 *    - Data processing status
 *    - Maintenance announcements
 * 
 * CONNECTION MANAGEMENT:
 * - Automatic connection establishment
 * - Heartbeat/ping-pong for keep-alive
 * - Exponential backoff for reconnection
 * - Connection state tracking (connecting/connected/disconnected)
 * - Graceful degradation when offline
 * 
 * RECONNECTION STRATEGY:
 * - Initial retry after 1 second
 * - Exponential backoff (1s, 2s, 4s, 8s, 16s, max 30s)
 * - Maximum retry attempts (e.g., 10 times)
 * - Reset retry count on successful connection
 * - Stop retrying when component unmounts
 * 
 * STATE MANAGEMENT:
 * - Connection status (connecting/connected/disconnected/error)
 * - Last message timestamp
 * - Retry attempt count
 * - Error messages and types
 * - Queue messages when disconnected
 * 
 * HOOKS INTERFACE:
 * ```javascript
 * const {
 *   connectionStatus,
 *   lastMessage,
 *   lastUpdated,
 *   retryCount,
 *   connect,
 *   disconnect
 * } = useWebSocket(siteId, token);
 * ```
 * 
 * MESSAGE PARSING:
 * - JSON message validation
 * - Type checking for message structure
 * - Error handling for malformed messages
 * - Message queuing during disconnection
 * - Duplicate message filtering
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Message throttling for high-frequency updates
 * - Batch processing of multiple messages
 * - Memory cleanup for old messages
 * - Efficient re-rendering with React hooks
 * 
 * ERROR HANDLING:
 * - Network connectivity issues
 * - Authentication failures
 * - Server-side errors
 * - Message parsing errors
 * - Connection timeout handling
 * 
 * SECURITY:
 * - Token-based authentication
 * - Origin validation
 * - Message integrity checks
 * - Rate limiting awareness
 * - CSRF protection considerations
 * 
 * USER FEEDBACK:
 * - Visual connection status indicator (green/red dot)
 * - "Live" badge when receiving updates
 * - Offline notification when disconnected
 * - Retry progress indication
 * - Last update timestamp display
 * 
 * INTEGRATION WITH DASHBOARD:
 * - Update visitor counts in real-time
 * - Flash new pageview notifications
 * - Update charts with new data points
 * - Show real-time geographic activity
 * - Refresh performance metrics
 * 
 * MOBILE CONSIDERATIONS:
 * - Handle mobile app backgrounding
 * - Reconnect when app becomes active
 * - Battery-efficient connection management
 * - Reduced update frequency on slow connections
 * 
 * CLEANUP:
 * - Close connection on component unmount
 * - Clear event listeners
 * - Cancel pending reconnection attempts
 * - Memory leak prevention
 * 
 * DEBUGGING:
 * - Console logging for development
 * - Connection event tracking
 * - Message history for debugging
 * - Performance metrics collection
 */
