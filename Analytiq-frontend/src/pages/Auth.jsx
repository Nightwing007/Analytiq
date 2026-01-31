/**
 * Auth.jsx - Authentication Page (Login/Signup)
 * Clean electric blue theme matching dashboard design
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirmation,
  sanitizeInput,
  handleApiError 
} from '../utils.js';
import { THEME_CONFIG } from '../config.js';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';

const authCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .auth-container {
    animation: fadeIn 0.6s ease-out;
  }

  .auth-input:focus {
    outline: none;
    border-color: ${darkElectricBlue} !important;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }

  .auth-input.error {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @media (max-width: 640px) {
    .auth-title {
      font-size: 2rem !important;
    }
  }
`;

let cssInjected = false;
const injectAuthCSS = () => {
  if (!cssInjected && typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = authCSS;
    document.head.appendChild(style);
    cssInjected = true;
  }
};

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('none');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectAuthCSS();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/manage';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [isLoginMode, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    if (name === 'password') {
      const { strength } = validatePassword(sanitizedValue);
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const errors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }

    if (!isLoginMode) {
      const confirmPasswordValidation = validatePasswordConfirmation(
        formData.password, 
        formData.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        errors.confirmPassword = confirmPasswordValidation.error;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        const from = location.state?.from?.pathname || '/manage';
        navigate(from, { replace: true });
      } else {
        await signup(formData.email, formData.password);
        toast.success('Account created successfully!');
        navigate('/manage', { replace: true });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      const errorMessage = err.message || 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setPasswordStrength('none');
    clearError();
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return THEME_CONFIG.COLORS.success;
      case 'medium': return THEME_CONFIG.COLORS.warning;
      case 'weak': return THEME_CONFIG.COLORS.error;
      default: return THEME_CONFIG.COLORS.textMuted;
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'strong': return '100%';
      case 'medium': return '66%';
      case 'weak': return '33%';
      default: return '0%';
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        overflowX: 'hidden'
      }}
    >
      <div 
        className="auth-container" 
        style={{ 
          maxWidth: '28rem',
          width: '100%'
        }}
      >
        <div 
          style={{
            border: `2px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
            padding: '2.5rem',
            transition: 'all 300ms ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = darkElectricBlue;
            e.currentTarget.style.boxShadow = `0 0 20px ${darkElectricBlue}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 
              className="auth-title"
              style={{ 
                fontFamily: "'Orbitron', monospace",
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                fontWeight: 700,
                color: THEME_CONFIG.COLORS.textPrimary,
                letterSpacing: '1px',
                marginBottom: '0.5rem',
                textShadow: `0 0 20px ${darkElectricBlue}22`
              }}
            >
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p 
              style={{ 
                fontFamily: "'Rajdhani', sans-serif",
                color: THEME_CONFIG.COLORS.textSecondary,
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              {isLoginMode ? 'Sign in to your account' : 'Sign up for a new account'}
            </p>
            <div>
              <span 
                style={{ 
                  fontSize: '0.875rem',
                  color: THEME_CONFIG.COLORS.textMuted,
                  fontFamily: "'Rajdhani', sans-serif"
                }}
              >
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: darkElectricBlue,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: "'Rajdhani', sans-serif",
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.target.style.color = darkerElectricBlue}
                onMouseLeave={(e) => e.target.style.color = darkElectricBlue}
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Global Error */}
            {error && (
              <div 
                style={{ 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                  border: `1px solid ${THEME_CONFIG.COLORS.error}`,
                  backgroundColor: `${THEME_CONFIG.COLORS.error}15`,
                  color: THEME_CONFIG.COLORS.error,
                  fontSize: '0.875rem',
                  fontFamily: "'Rajdhani', sans-serif"
                }}
              >
                {handleApiError({ message: error })}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              {/* Email Field */}
              <div style={{ width: '100%' }}>
                <label 
                  htmlFor="email"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <Mail size={14} />
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`auth-input ${formErrors.email ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: `2px solid ${formErrors.email ? THEME_CONFIG.COLORS.error : THEME_CONFIG.COLORS.borderPrimary}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontSize: '1rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    transition: 'border-color 200ms ease'
                  }}
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p 
                    style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: THEME_CONFIG.COLORS.error,
                      fontFamily: "'Rajdhani', sans-serif"
                    }}
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div style={{ width: '100%' }}>
                <label 
                  htmlFor="password"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: THEME_CONFIG.COLORS.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <Lock size={14} />
                  Password
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`auth-input ${formErrors.password ? 'error' : ''}`}
                    style={{
                      width: '100%',
                      padding: '0.875rem 3rem 0.875rem 1rem',
                      border: `2px solid ${formErrors.password ? THEME_CONFIG.COLORS.error : THEME_CONFIG.COLORS.borderPrimary}`,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                      color: THEME_CONFIG.COLORS.textPrimary,
                      fontSize: '1rem',
                      fontFamily: "'Rajdhani', sans-serif",
                      transition: 'border-color 200ms ease'
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: THEME_CONFIG.COLORS.textMuted,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 200ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = darkElectricBlue}
                    onMouseLeave={(e) => e.currentTarget.style.color = THEME_CONFIG.COLORS.textMuted}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p 
                    style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: THEME_CONFIG.COLORS.error,
                      fontFamily: "'Rajdhani', sans-serif"
                    }}
                  >
                    {formErrors.password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {!isLoginMode && formData.password && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div 
                        style={{ 
                          flex: 1,
                          height: '0.5rem',
                          borderRadius: THEME_CONFIG.BORDER_RADIUS.full,
                          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{
                            height: '100%',
                            width: getPasswordStrengthWidth(),
                            backgroundColor: getPasswordStrengthColor(),
                            transition: 'all 300ms ease',
                            borderRadius: THEME_CONFIG.BORDER_RADIUS.full
                          }}
                        />
                      </div>
                      <span 
                        style={{ 
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          minWidth: '4rem',
                          color: getPasswordStrengthColor(),
                          fontFamily: "'Rajdhani', sans-serif"
                        }}
                      >
                        {passwordStrength !== 'none' ? passwordStrength : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              {!isLoginMode && (
                <div style={{ width: '100%' }}>
                  <label 
                    htmlFor="confirmPassword"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: THEME_CONFIG.COLORS.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <Lock size={14} />
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`auth-input ${formErrors.confirmPassword ? 'error' : ''}`}
                      style={{
                        width: '100%',
                        padding: '0.875rem 3rem 0.875rem 1rem',
                        border: `2px solid ${formErrors.confirmPassword ? THEME_CONFIG.COLORS.error : THEME_CONFIG.COLORS.borderPrimary}`,
                        borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
                        color: THEME_CONFIG.COLORS.textPrimary,
                        fontSize: '1rem',
                        fontFamily: "'Rajdhani', sans-serif",
                        transition: 'border-color 200ms ease'
                      }}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ 
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: THEME_CONFIG.COLORS.textMuted,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 200ms ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = darkElectricBlue}
                      onMouseLeave={(e) => e.currentTarget.style.color = THEME_CONFIG.COLORS.textMuted}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p 
                      style={{ 
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: THEME_CONFIG.COLORS.error,
                        fontFamily: "'Rajdhani', sans-serif"
                      }}
                    >
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1rem',
                border: `2px solid ${darkElectricBlue}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: 'transparent',
                color: darkElectricBlue,
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || isLoading ? 0.6 : 1,
                transition: 'all 300ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isLoading) {
                  e.currentTarget.style.backgroundColor = darkElectricBlue;
                  e.currentTarget.style.color = THEME_CONFIG.COLORS.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = darkElectricBlue;
              }}
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <Loader2 size={18} className="loading-spinner" />
                  {isLoginMode ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLoginMode ? 'Sign In' : 'Sign Up'
              )}
            </button>

            {/* Terms */}
            {!isLoginMode && (
              <p 
                style={{ 
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: THEME_CONFIG.COLORS.textMuted,
                  fontFamily: "'Rajdhani', sans-serif"
                }}
              >
                By signing up, you agree to our{' '}
                <a 
                  href="/terms" 
                  style={{ 
                    color: darkElectricBlue,
                    textDecoration: 'underline'
                  }}
                >
                  Terms
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy"
                  style={{ 
                    color: darkElectricBlue,
                    textDecoration: 'underline'
                  }}
                >
                  Privacy Policy
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
