/**
 * useAuth.js - Authentication Hook
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Manage user authentication state
 * - Handle login/logout operations
 * - JWT token management
 * - Automatic token refresh
 * - Authentication status checking
 * 
 * HOOK INTERFACE:
 * ```javascript
 * const {
 *   user,           // Current user object or null
 *   isAuthenticated, // Boolean authentication status
 *   isLoading,      // Loading state during auth operations
 *   login,          // (email, password) => Promise
 *   signup,         // (email, password) => Promise
 *   logout,         // () => void
 *   refreshToken,   // () => Promise
 *   error           // Current error message
 * } = useAuth();
 * ```
 * 
 * STATE MANAGEMENT:
 * - User profile data
 * - Authentication status
 * - Loading states for auth operations
 * - Error messages
 * - Token expiration tracking
 * 
 * TOKEN HANDLING:
 * - Store JWT in localStorage or httpOnly cookie
 * - Automatic token refresh before expiration
 * - Token validation on app startup
 * - Clear tokens on logout
 * - Handle token expiration gracefully
 * 
 * API INTEGRATION:
 * - POST /api/login for authentication
 * - POST /api/signup for user registration
 * - GET /api/me for user profile (if implemented)
 * - POST /api/refresh for token refresh (if implemented)
 * 
 * SIDE EFFECTS:
 * - Redirect to login page when unauthenticated
 * - Redirect to dashboard after successful login
 * - Clear user data on logout
 * - Show notifications for auth events
 * 
 * ERROR HANDLING:
 * - Network connectivity issues
 * - Invalid credentials
 * - Expired tokens
 * - Server errors
 * - Validation errors
 * 
 * PERSISTENCE:
 * - Remember authentication state across sessions
 * - Auto-login on app restart
 * - Secure token storage
 * - Clear data on logout
 * 
 * SECURITY CONSIDERATIONS:
 * - Secure token storage
 * - Token expiration handling
 * - CSRF protection
 * - Input validation
 * - Logout on security events
 */