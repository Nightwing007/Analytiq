/**
 * AuthContext.js - Authentication Context Provider
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../components/API.js';

// Auth action types
const AUTH_ACTIONS = {
  LOADING: 'LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  ERROR: 'ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER'
};

// Initial auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing authentication...');
      
      try {
        dispatch({ type: AUTH_ACTIONS.LOADING });

        // First check if token exists and is not expired
        const hasValidToken = apiClient.isAuthenticated();
        console.log('AuthContext: Has valid token:', hasValidToken);

        if (hasValidToken) {
          console.log('AuthContext: Valid token found, validating with backend...');
          
          // Validate token with backend using our new method
          const validationResult = await apiClient.validateToken();
          
          if (validationResult && validationResult.valid && validationResult.user) {
            console.log('AuthContext: Token validated successfully');
            console.log('AuthContext: User data from validation:', validationResult.user);
            
            // Use the user data from the validation response
            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: validationResult.user
            });
            return; // Success - exit early
          } else {
            console.log('AuthContext: Token validation failed, trying refresh...');
            
            // Try to refresh the token before giving up
            const refreshResult = await apiClient.refreshToken();
            
            if (refreshResult && refreshResult.access_token) {
              console.log('AuthContext: Token refreshed, re-validating...');
              
              // Re-validate with the new token
              const revalidationResult = await apiClient.validateToken();
              
              if (revalidationResult && revalidationResult.valid && revalidationResult.user) {
                console.log('AuthContext: Re-validation successful after refresh');
                dispatch({
                  type: AUTH_ACTIONS.SET_USER,
                  payload: revalidationResult.user
                });
                return;
              }
            }
            
            console.log('AuthContext: Token refresh and validation failed, logging out');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
            return;
          }
        }

        // No valid token or user data
        console.log('AuthContext: No valid authentication, logging out');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });

      } catch (error) {
        console.error('AuthContext: Initialization error:', error);
        // On any initialization error, clear auth state
        apiClient.removeToken();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Set up automatic token refresh when user is authenticated
  useEffect(() => {
    let refreshInterval;

    if (state.isAuthenticated && !state.isLoading) {
      console.log('AuthContext: Setting up token refresh timer');
      
      // Refresh token every 20 hours (4 hours before 24h expiration)
      const refreshIntervalMs = 20 * 60 * 60 * 1000; // 20 hours
      
      refreshInterval = setInterval(async () => {
        console.log('AuthContext: Automatic token refresh triggered');
        
        try {
          const refreshResult = await apiClient.refreshToken();
          
          if (refreshResult && refreshResult.access_token) {
            console.log('AuthContext: Token refreshed successfully');
            
            // Re-validate to update user data
            const validationResult = await apiClient.validateToken();
            if (validationResult && validationResult.user) {
              dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: validationResult.user
              });
            }
          } else {
            console.log('AuthContext: Token refresh failed, logging out');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (error) {
          console.error('AuthContext: Error during automatic token refresh:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }, refreshIntervalMs);

      console.log('AuthContext: Token refresh timer set for', refreshIntervalMs / (60 * 60 * 1000), 'hours');
    }

    // Cleanup interval when user logs out or component unmounts
    return () => {
      if (refreshInterval) {
        console.log('AuthContext: Clearing token refresh timer');
        clearInterval(refreshInterval);
      }
    };
  }, [state.isAuthenticated, state.isLoading]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const response = await apiClient.login(email, password);

      // Create user object from response
      const user = {
        email: email,
        ...response.user
      };

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.ERROR,
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  }, []);

  // Signup function
  const signup = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      // First create the account
      const signupResponse = await apiClient.signup(email, password);

      // Then automatically log them in
      const loginResponse = await apiClient.login(email, password);

      // Create user object
      const user = {
        email: email,
        ...signupResponse,
        ...loginResponse.user
      };

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });

      return { signup: signupResponse, login: loginResponse };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.ERROR,
        payload: error.message || 'Signup failed'
      });
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    apiClient.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Update user function
  const updateUser = useCallback((userData) => {
    const updatedUser = { ...state.user, ...userData };
    apiClient.setUser(updatedUser);
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: updatedUser
    });
  }, [state.user]);

  // Manual token refresh function
  const refreshUserToken = useCallback(async () => {
    try {
      console.log('AuthContext: Manual token refresh requested');
      
      const refreshResult = await apiClient.refreshToken();
      
      if (refreshResult && refreshResult.access_token) {
        console.log('AuthContext: Manual token refresh successful');
        
        // Re-validate to update user data
        const validationResult = await apiClient.validateToken();
        if (validationResult && validationResult.user) {
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: validationResult.user
          });
          return { success: true, user: validationResult.user };
        }
      }
      
      console.log('AuthContext: Manual token refresh failed');
      return { success: false, error: 'Token refresh failed' };
      
    } catch (error) {
      console.error('AuthContext: Error during manual token refresh:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Context value
  const value = useMemo(() => ({
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    signup,
    logout,
    clearError,
    updateUser,
    refreshUserToken
  }), [state.user, state.isAuthenticated, state.isLoading, state.error, login, signup, logout, clearError, updateUser, refreshUserToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;