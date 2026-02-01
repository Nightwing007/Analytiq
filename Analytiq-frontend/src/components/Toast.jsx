/**
 * Toast.jsx - Toast Notification Component
 */

import React, { useState, useEffect } from 'react';
import { THEME_CONFIG } from '../config.js';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

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
      case 'success': return THEME_CONFIG.COLORS.electricBlue; // Use theme's primary blue for success
      case 'error': return THEME_CONFIG.COLORS.error;
      case 'warning': return THEME_CONFIG.COLORS.warning;
      default: return THEME_CONFIG.COLORS.electricBlue; // Default to theme blue
    }
  };

  const getToastIcon = () => {
    const iconSize = 20;
    const color = getToastColor();
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={iconSize} color={color} />;
      case 'error': return <AlertCircle size={iconSize} color={color} />;
      case 'warning': return <AlertTriangle size={iconSize} color={color} />;
      default: return <Info size={iconSize} color={color} />;
    }
  };

  return (
    <div
      style={{
        minWidth: '320px',
        width: 'auto',
        backgroundColor: toast.type === 'success' || toast.type === 'info'
          ? `${THEME_CONFIG.COLORS.backgroundElevated}EE`
          : `${THEME_CONFIG.COLORS.backgroundElevated}CC`,
        backdropFilter: 'blur(12px)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${getToastColor()}88`,
        borderRadius: '12px',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${getToastColor()}22, inset 0 0 10px ${getToastColor()}11`,
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 500ms cubic-bezier(0.19, 1, 0.22, 1)'
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
              color: THEME_CONFIG.COLORS.textPrimary
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
                padding: '4px',
                borderRadius: '50%',
                color: THEME_CONFIG.COLORS.textSecondary,
                opacity: 0.5,
                transition: 'all 200ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;