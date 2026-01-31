/**
 * useWebSocket.js - WebSocket Connection Hook
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Establish and maintain WebSocket connections
 * - Handle automatic reconnection with exponential backoff
 * - Parse and validate incoming messages
 * - Provide connection status and error handling
 * - Clean up connections on component unmount
 * 
 * HOOK INTERFACE:
 * ```javascript
 * const {
 *   connectionStatus, // 'connecting' | 'connected' | 'disconnected' | 'error'
 *   lastMessage,      // Latest received message
 *   lastUpdated,      // Timestamp of last message
 *   retryCount,       // Number of reconnection attempts
 *   sendMessage,      // (message) => void - Send message to server
 *   connect,          // () => void - Manual connection
 *   disconnect        // () => void - Manual disconnection
 * } = useWebSocket(url, options);
 * ```
 * 
 * CONNECTION MANAGEMENT:
 * - Automatic connection establishment
 * - Heartbeat/ping-pong for connection health
 * - Graceful disconnection on component unmount
 * - Connection pooling for multiple sites
 * 
 * RECONNECTION STRATEGY:
 * - Exponential backoff algorithm (1s, 2s, 4s, 8s, 16s, max 30s)
 * - Maximum retry attempts (configurable, default 10)
 * - Reset retry count on successful connection
 * - Stop reconnection on manual disconnect
 * 
 * MESSAGE HANDLING:
 * - JSON message parsing and validation
 * - Message type routing
 * - Error handling for malformed messages
 * - Message queuing during disconnection
 * - Duplicate message filtering
 * 
 * CONNECTION STATES:
 * - connecting: Initial connection attempt
 * - connected: Successfully connected and ready
 * - disconnected: Connection lost or not established
 * - error: Connection failed with errors
 * 
 * OPTIONS:
 * ```javascript
 * {
 *   autoConnect: true,        // Auto-connect on mount
 *   maxRetries: 10,          // Maximum reconnection attempts
 *   retryInterval: 1000,     // Initial retry delay (ms)
 *   maxRetryInterval: 30000, // Maximum retry delay (ms)
 *   heartbeatInterval: 30000, // Ping interval (ms)
 *   protocols: [],           // WebSocket sub-protocols
 *   onOpen: (event) => {},   // Connection opened callback
 *   onClose: (event) => {},  // Connection closed callback
 *   onError: (event) => {},  // Error callback
 *   onMessage: (data) => {}  // Message received callback
 * }
 * ```
 * 
 * AUTHENTICATION:
 * - Include JWT token in connection URL
 * - Handle authentication failures
 * - Refresh tokens before reconnection
 * - Secure WebSocket (WSS) for production
 * 
 * PERFORMANCE:
 * - Efficient event listener management
 * - Memory leak prevention
 * - Throttle high-frequency messages
 * - Batch message processing
 * 
 * ERROR HANDLING:
 * - Network connectivity issues
 * - Authentication failures
 * - Server-side errors
 * - Protocol upgrade failures
 * - Timeout handling
 * 
 * CLEANUP:
 * - Remove event listeners on unmount
 * - Cancel pending reconnection timers
 * - Close WebSocket connection
 * - Clear message queues
 */