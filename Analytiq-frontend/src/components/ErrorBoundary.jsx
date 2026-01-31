/**
 * ErrorBoundary.jsx - Error Boundary Component
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Catch JavaScript errors in component tree
 * - Display user-friendly error messages
 * - Log errors for debugging and monitoring
 * - Provide recovery options for users
 * - Prevent entire app crashes
 * 
 * ERROR HANDLING:
 * - React component errors
 * - Rendering errors
 * - Lifecycle method errors
 * - Event handler errors (indirectly)
 * - Async errors in components
 * 
 * FALLBACK UI:
 * - Clean error message display
 * - Retry button for recovery
 * - Report issue option
 * - Navigation back to safe pages
 * - Contact support information
 * 
 * ERROR TYPES:
 * - Network connectivity issues
 * - API response parsing errors
 * - Chart rendering failures
 * - WebSocket connection errors
 * - Authentication failures
 * 
 * LOGGING AND MONITORING:
 * - Log error details to console (development)
 * - Send error reports to monitoring service
 * - Include component stack traces
 * - User agent and environment info
 * - User action context
 * 
 * RECOVERY MECHANISMS:
 * - Page refresh option
 * - Component retry functionality
 * - Navigate to dashboard
 * - Clear local storage option
 * - Contact support flow
 * 
 * PROPS INTERFACE:
 * - children: React.ReactNode
 * - fallback: React.ComponentType
 * - onError: (error, errorInfo) => void
 * - level: 'component' | 'page' | 'app'
 * 
 * USER EXPERIENCE:
 * - Non-technical error messages
 * - Clear recovery instructions
 * - Consistent with app design
 * - Preserve user data when possible
 * - Graceful degradation
 * 
 * DEVELOPMENT:
 * - Detailed error information in dev mode
 * - Component stack traces
 * - Error reproduction steps
 * - Performance impact monitoring
 */