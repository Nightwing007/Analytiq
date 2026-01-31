/**
 * Toast.jsx - Toast Notification Component
 */

import React, { useState, useEffect } from 'react';
import { THEME_CONFIG } from '../config.js';

// Toast context for global toast management
const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    addToast,
    removeToast,
    toast: {
      success: (message, duration) => addToast(message, 'success', duration),
      error: (message, duration) => addToast(message, 'error', duration),
      warning: (message, duration) => addToast(message, 'warning', duration),
      info: (message, duration) => addToast(message, 'info', duration),
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '90vw',
        width: 'auto'
      }}
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastColor = () => {
    switch (toast.type) {
      case 'success': return THEME_CONFIG.COLORS.success;
      case 'error': return THEME_CONFIG.COLORS.error;
      case 'warning': return THEME_CONFIG.COLORS.warning;
      default: return THEME_CONFIG.COLORS.info;
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '500px',
        width: 'auto',
        backgroundColor: THEME_CONFIG.COLORS.white,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: getToastColor(),
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 300ms ease-in-out'
      }}
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ flexShrink: 0, fontSize: '1.125rem', lineHeight: '1.75rem' }}>
            {getToastIcon()}
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            <p style={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: '1.5',
              margin: 0,
              color: THEME_CONFIG.COLORS.background
            }}>
              {toast.message}
            </p>
          </div>
          <div style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
            <button
              onClick={handleClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                fontSize: '1.5rem',
                lineHeight: '1',
                color: THEME_CONFIG.COLORS.background,
                opacity: 0.6,
                transition: 'opacity 200ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <span style={{ 
                width: '20px', 
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>×</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;