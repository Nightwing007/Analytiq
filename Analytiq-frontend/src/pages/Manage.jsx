/**
 * Manage.jsx - Site Management Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { THEME_CONFIG } from '../config.js';
import API from '../components/API.js';
import SnippetView from '../components/SnippetView.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Plus, Globe, BarChart3, Trash2, Check } from 'lucide-react';
import NavLogo from '../assets/NavLogo.png';

// Dark blue electric neon colors
const darkElectricBlue = '#0066FF';
const darkerElectricBlue = '#0052CC';
const buttonBackground = 'rgb(18, 18, 24)';

// CSS for the neon border animation, card hover effects, and loading animation
const neonBorderCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  @keyframes neonBorderTop {
    0% { 
      border-top-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-right-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-bottom-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-left-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      box-shadow: none;
    }
    25% { 
      border-top-color: ${darkElectricBlue};
      border-right-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-bottom-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-left-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      box-shadow: 0 -2px 10px ${darkElectricBlue}55;
    }
    50% { 
      border-top-color: ${darkElectricBlue};
      border-right-color: ${darkElectricBlue};
      border-bottom-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      border-left-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      box-shadow: 2px -2px 10px ${darkElectricBlue}55;
    }
    75% { 
      border-top-color: ${darkElectricBlue};
      border-right-color: ${darkElectricBlue};
      border-bottom-color: ${darkElectricBlue};
      border-left-color: ${THEME_CONFIG.COLORS.backgroundSecondary};
      box-shadow: 2px 2px 10px ${darkElectricBlue}55;
    }
    100% { 
      border-top-color: ${darkElectricBlue};
      border-right-color: ${darkElectricBlue};
      border-bottom-color: ${darkElectricBlue};
      border-left-color: ${darkElectricBlue};
      box-shadow: 
        0 0 12px ${darkElectricBlue}44,
        0 0 24px ${darkElectricBlue}33;
    }
  }

  @keyframes expandBottomBorder {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes cardGlide {
    0% {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }

  @keyframes cardStagger {
    0% {
      opacity: 0;
      transform: translateY(60px) translateX(-20px) scale(0.9);
      filter: blur(4px);
    }
    60% {
      opacity: 0.8;
      transform: translateY(20px) translateX(-5px) scale(0.98);
      filter: blur(1px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px) translateX(0px) scale(1);
      filter: blur(0px);
    }
  }

  .neon-border-btn {
    position: relative;
    transition: all 300ms ease;
  }

  .neon-border-btn:hover {
    color: ${darkElectricBlue} !important;
    background-color: ${buttonBackground} !important;
    transform: translateY(-1px);
    animation: neonBorderTop 1.0s ease-in-out forwards;
    // border: px solid rgb(255, 255, 255);
  }

  .neon-border-btn:not(:hover) {
    border-color: ${THEME_CONFIG.COLORS.textPrimary} !important;
    background-color: transparent !important;
    box-shadow: none !important;
    transform: translateY(0px);
    // border: 2px solid rgb(255, 255, 255);
  }

  .neon-border-btn:active {
    transform: translateY(0px) scale(0.98);
    animation-duration: 0.3s;
  }

  .card-hover-effect {
    position: relative;
    overflow: hidden;
  }

  .card-hover-effect::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background-color: transparent;
    transition: all 400ms ease-in-out;
    z-index: 10;
  }

  .card-hover-effect.blue-hover:hover::after {
    width: 100%;
    background-color: ${darkElectricBlue};
    box-shadow: 0 0 10px ${darkElectricBlue}77;
  }

  .card-hover-effect.red-hover:hover::after {
    width: 100%;
    background-color: ${THEME_CONFIG.COLORS.error};
    box-shadow: 0 0 8px ${THEME_CONFIG.COLORS.error}66;
  }

  .card-glide-animation {
    animation: cardStagger 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
  }

  .card-glide-animation:nth-child(1) { animation-delay: 0.1s; }
  .card-glide-animation:nth-child(2) { animation-delay: 0.2s; }
  .card-glide-animation:nth-child(3) { animation-delay: 0.3s; }
  .card-glide-animation:nth-child(4) { animation-delay: 0.4s; }
  .card-glide-animation:nth-child(5) { animation-delay: 0.5s; }
  .card-glide-animation:nth-child(6) { animation-delay: 0.6s; }

  .cool-title {
    font-family: 'Orbitron', monospace;
    letter-spacing: 1px;
    text-shadow: 0 0 20px ${darkElectricBlue}33;
  }

  .card-title {
    font-family: 'Rajdhani', sans-serif;
    letter-spacing: 0.5px;
  }
`;

// Inject the CSS once
let cssInjected = false;
const injectNeonBorderCSS = () => {
  if (!cssInjected && typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = neonBorderCSS;
    document.head.appendChild(style);
    cssInjected = true;
  }
};

function Manage() {
  const { user, logout } = useAuth();
  const { addToast: showToast } = useToast();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSiteResponse, setNewSiteResponse] = useState(null);
  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    timezone: 'UTC'
  });
  const [verificationStatus, setVerificationStatus] = useState({}); // { siteId: { loading, verified, error } }

  useEffect(() => {
    fetchSites();
    // Inject the neon border CSS
    injectNeonBorderCSS();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await API.getSites();
      setSites(response || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      showToast('Failed to load sites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    if (!newSite.name || !newSite.url) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await API.createSite(newSite);
      setSites([...sites, response]);
      setNewSite({ name: '', url: '', timezone: 'UTC' });
      setShowAddForm(false);
      setNewSiteResponse(response); // Show snippet for newly created site
      showToast('Site added successfully! Here\'s your tracking snippet:', 'success');
    } catch (error) {
      console.error('Error adding site:', error);
      showToast('Failed to add site', 'error');
    }
  };

  const handleDeleteSite = async (siteId) => {
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return;
    }

    try {
      await API.deleteSite(siteId);
      setSites(sites.filter(site => site.site_id !== siteId));
      showToast('Site deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting site:', error);
      showToast('Failed to delete site', 'error');
    }
  };

  const handleVerifySite = async (siteId) => {
    try {
      setVerificationStatus(prev => ({
        ...prev,
        [siteId]: { loading: true }
      }));

      const response = await API.verifySite(siteId);

      if (response.verified) {
        setVerificationStatus(prev => ({
          ...prev,
          [siteId]: { loading: false, verified: true }
        }));
        // Update sites list
        setSites(sites.map(s => s.site_id === siteId ? { ...s, verified: true } : s));
        showToast('Website verified successfully!', 'success');
      } else {
        setVerificationStatus(prev => ({
          ...prev,
          [siteId]: { loading: false, verified: false, error: response.message }
        }));
        console.warn('Verification failed for site:', siteId, response);
        showToast(response.message, 'error');
      }
    } catch (error) {
      console.error('Error verifying site:', error);
      setVerificationStatus(prev => ({
        ...prev,
        [siteId]: { loading: false, verified: false, error: error.message || 'Verification failed' }
      }));
      showToast('Verification failed: ' + (error.message || 'Server error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
          fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
        }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen"
      style={{
        backgroundColor: THEME_CONFIG.COLORS.backgroundDark,
        fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary
      }}>
      {/* Header with proper padding */}
      <header className="h-16 flex items-center justify-between border-b"
        style={{
          paddingLeft: '32px',
          paddingRight: '32px',
          borderColor: THEME_CONFIG.COLORS.borderPrimary,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary
        }}>
        <div className="flex items-center">
          <img
            src={NavLogo}
            alt="Analytiq"
            style={{ height: '32px', width: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm"
            style={{
              color: THEME_CONFIG.COLORS.textSecondary,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall
            }}>
            Welcome, {user?.email || 'User'}
          </span>
          <Link to="/auth-test" style={{ textDecoration: 'none' }}>
            <button
              className="transition-all duration-300"
              style={{
                padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
                border: `2px solid ${darkElectricBlue}`,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                backgroundColor: 'transparent',
                color: darkElectricBlue,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                cursor: 'pointer',
                minHeight: '36px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = darkerElectricBlue;
                e.target.style.color = darkerElectricBlue;
                e.target.style.backgroundColor = buttonBackground;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = darkElectricBlue;
                e.target.style.color = darkElectricBlue;
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Auth Test
            </button>
          </Link>
          <button
            onClick={logout}
            className="transition-all duration-300"
            style={{
              padding: `${THEME_CONFIG.SPACING.sm} ${THEME_CONFIG.SPACING.md}`,
              border: `2px solid ${THEME_CONFIG.COLORS.error}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              backgroundColor: 'transparent',
              color: THEME_CONFIG.COLORS.error,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
              cursor: 'pointer',
              minHeight: '36px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = THEME_CONFIG.COLORS.error;
              e.target.style.color = THEME_CONFIG.COLORS.error;
              e.target.style.backgroundColor = THEME_CONFIG.COLORS.error + '20';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = THEME_CONFIG.COLORS.error;
              e.target.style.color = THEME_CONFIG.COLORS.error;
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12" style={{ maxWidth: '1280px' }}>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="cool-title font-bold mb-3"
              style={{
                color: THEME_CONFIG.COLORS.textPrimary,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h1,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold
              }}>
              Your Websites
            </h2>
            <p className="text-lg"
              style={{
                color: THEME_CONFIG.COLORS.textSecondary,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodyLarge
              }}>
              Manage your websites and view analytics
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center transition-all duration-300"
            style={{
              padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.xl}`,
              border: `2px solid ${darkElectricBlue}`,
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              backgroundColor: 'transparent',
              color: darkElectricBlue,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
              cursor: 'pointer',
              minHeight: '52px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = darkerElectricBlue;
              e.target.style.color = darkerElectricBlue;
              e.target.style.backgroundColor = buttonBackground;
              e.target.style.transform = 'scale(0.98)';
              e.target.style.boxShadow = `0 0 8px ${darkElectricBlue}44`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = darkElectricBlue;
              e.target.style.color = darkElectricBlue;
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus size={18} style={{ marginRight: '8px' }} />
            Add Website
          </button>
        </div>

        {/* Add Site Form */}
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="border p-8 max-w-md w-full mx-4"
              style={{
                backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
                borderColor: THEME_CONFIG.COLORS.borderPrimary,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.large
              }}>
              <h3 className="font-bold mb-6"
                style={{
                  color: THEME_CONFIG.COLORS.textPrimary,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h3,
                  fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold
                }}>
                Add New Website
              </h3>
              <form onSubmit={handleAddSite}>
                <div className="mb-6">
                  <label className="block font-medium mb-3"
                    style={{
                      color: THEME_CONFIG.COLORS.textPrimary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium
                    }}>
                    Website Name *
                  </label>
                  <input
                    type="text"
                    value={newSite.name}
                    onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                    className="w-full px-4 py-3 border transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: THEME_CONFIG.COLORS.borderPrimary,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
                      color: THEME_CONFIG.COLORS.textPrimary,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
                    }}
                    placeholder="My Awesome Website"
                    onFocus={(e) => {
                      e.target.style.borderColor = darkElectricBlue;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                    }}
                    required
                  />
                </div>
                <div className="mb-8">
                  <label className="block font-medium mb-3"
                    style={{
                      color: THEME_CONFIG.COLORS.textPrimary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium
                    }}>
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={newSite.url}
                    onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                    className="w-full px-4 py-3 border transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: THEME_CONFIG.COLORS.borderPrimary,
                      backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
                      color: THEME_CONFIG.COLORS.textPrimary,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
                    }}
                    placeholder="https://mywebsite.com"
                    onFocus={(e) => {
                      e.target.style.borderColor = darkElectricBlue;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                    }}
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 transition-all duration-300"
                    style={{
                      padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
                      border: `2px solid ${darkElectricBlue}`,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      backgroundColor: 'transparent',
                      color: darkElectricBlue,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = darkerElectricBlue;
                      e.target.style.color = darkerElectricBlue;
                      e.target.style.backgroundColor = buttonBackground;
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = darkElectricBlue;
                      e.target.style.color = darkElectricBlue;
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Add Website
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 transition-all duration-300"
                    style={{
                      padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
                      border: `2px solid ${THEME_CONFIG.COLORS.textSecondary}`,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      backgroundColor: 'transparent',
                      color: THEME_CONFIG.COLORS.textSecondary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium,
                      fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = THEME_CONFIG.COLORS.textPrimary;
                      e.target.style.color = THEME_CONFIG.COLORS.textPrimary;
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = THEME_CONFIG.COLORS.textSecondary;
                      e.target.style.color = THEME_CONFIG.COLORS.textSecondary;
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Site Snippet Modal - Shows only once after site creation */}
        {newSiteResponse && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="border p-8 max-w-3xl w-full mx-4"
              style={{
                backgroundColor: THEME_CONFIG.COLORS.backgroundElevated,
                borderColor: THEME_CONFIG.COLORS.borderPrimary,
                borderRadius: THEME_CONFIG.BORDER_RADIUS.large
              }}>
              <div className="mb-6">
                <h3 className="font-bold mb-3"
                  style={{
                    color: THEME_CONFIG.COLORS.textPrimary,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h3,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.bold
                  }}>
                  🎉 Site Created Successfully!
                </h3>
                <p style={{
                  color: THEME_CONFIG.COLORS.textSecondary,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
                }}>
                  Here's your tracking snippet. Copy and paste it into your website's HTML:
                </p>
              </div>

              <SnippetView
                siteId={newSiteResponse.site_id}
                siteUrl={newSiteResponse.url}
                snippet={newSiteResponse.snippet}
                verificationStatus={verificationStatus[newSiteResponse.site_id]}
                onVerify={() => handleVerifySite(newSiteResponse.site_id)}
              />

              <div className="mt-6 p-4"
                style={{
                  backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
                  border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
                }}>
                <p style={{
                  color: THEME_CONFIG.COLORS.textPrimary,
                  fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall
                }}>
                  <strong style={{ color: darkElectricBlue }}>Important:</strong> This snippet will only be shown once. Make sure to copy it now!
                </p>
              </div>

              {!verificationStatus[newSiteResponse.site_id]?.verified ? (
                <button
                  onClick={() => handleVerifySite(newSiteResponse.site_id)}
                  disabled={verificationStatus[newSiteResponse.site_id]?.loading}
                  className="w-full transition-all duration-300"
                  style={{
                    marginTop: '24px',
                    padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
                    border: `2px solid ${darkElectricBlue}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    backgroundColor: darkElectricBlue,
                    color: '#FFFFFF',
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                    cursor: verificationStatus[newSiteResponse.site_id]?.loading ? 'not-allowed' : 'pointer',
                    minHeight: '44px',
                    opacity: verificationStatus[newSiteResponse.site_id]?.loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!verificationStatus[newSiteResponse.site_id]?.loading) {
                      e.target.style.backgroundColor = darkerElectricBlue;
                      e.target.style.borderColor = darkerElectricBlue;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!verificationStatus[newSiteResponse.site_id]?.loading) {
                      e.target.style.backgroundColor = darkElectricBlue;
                      e.target.style.borderColor = darkElectricBlue;
                    }
                  }}
                >
                  {verificationStatus[newSiteResponse.site_id]?.loading ? 'Verifying...' : 'Verify Website Now'}
                </button>
              ) : (
                <button
                  onClick={() => setNewSiteResponse(null)}
                  className="w-full transition-all duration-300"
                  style={{
                    marginTop: '24px',
                    padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
                    border: `2px solid ${darkElectricBlue}`,
                    borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                    backgroundColor: 'transparent',
                    color: darkElectricBlue,
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                    fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                    fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                    cursor: 'pointer',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = darkerElectricBlue;
                    e.target.style.color = darkerElectricBlue;
                    e.target.style.backgroundColor = buttonBackground;
                    e.target.style.transform = 'scale(0.98)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = darkElectricBlue;
                    e.target.style.color = darkElectricBlue;
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Got it, Close
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={64} className="mx-auto mb-6"
              style={{ color: THEME_CONFIG.COLORS.textMuted }} />
            <h3 className="font-semibold mb-3"
              style={{
                color: THEME_CONFIG.COLORS.textPrimary,
                fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h4,
                fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold
              }}>
              No websites yet
            </h3>
            <p style={{
              color: THEME_CONFIG.COLORS.textSecondary,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
            }}>
              Add your first website to start tracking analytics
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site, index) => (
              <div key={site.site_id}
                className="card-hover-effect card-glide-animation border transition-all duration-300"
                style={{
                  borderColor: THEME_CONFIG.COLORS.borderPrimary,
                  backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
                  borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
                  padding: THEME_CONFIG.SPACING.lg,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderElectric;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
                }}>

                {/* Header with title and delete button */}
                <div className="flex items-start justify-between"
                  style={{ marginBottom: THEME_CONFIG.SPACING.lg }}>
                  <div className="flex-1" style={{ marginRight: THEME_CONFIG.SPACING.md }}>
                    <h3 className="card-title font-semibold"
                      style={{
                        color: THEME_CONFIG.COLORS.textPrimary,
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h4,
                        fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                        marginBottom: THEME_CONFIG.SPACING.sm,
                        lineHeight: '1.4'
                      }}>
                      {site.name}
                    </h3>
                    <p className="break-all"
                      style={{
                        color: THEME_CONFIG.COLORS.textSecondary,
                        fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                        lineHeight: '1.4'
                      }}>
                      {site.url}
                    </p>
                    {site.verified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">
                        <Check size={10} style={{ marginRight: '4px' }} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                        Unverified
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSite(site.site_id)}
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      backgroundColor: 'transparent',
                      border: `2px solid ${THEME_CONFIG.COLORS.error}`,
                      color: THEME_CONFIG.COLORS.error,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = THEME_CONFIG.COLORS.error + '20';
                      e.target.style.transform = 'scale(1.1)';
                      // Add red hover class to parent card
                      const card = e.target.closest('.card-hover-effect');
                      if (card) {
                        card.classList.add('red-hover');
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'scale(1)';
                      // Remove red hover class from parent card
                      const card = e.target.closest('.card-hover-effect');
                      if (card) {
                        card.classList.remove('red-hover');
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Site metadata */}
                <div style={{ marginBottom: THEME_CONFIG.SPACING.lg }}>
                  <div className="flex justify-between items-center"
                    style={{ marginBottom: THEME_CONFIG.SPACING.sm }}>
                    <span style={{
                      color: THEME_CONFIG.COLORS.textMuted,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall
                    }}>
                      Created:
                    </span>
                    <span style={{
                      color: THEME_CONFIG.COLORS.textSecondary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium
                    }}>
                      {new Date(site.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{
                      color: THEME_CONFIG.COLORS.textMuted,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall
                    }}>
                      Timezone:
                    </span>
                    <span style={{
                      color: THEME_CONFIG.COLORS.textSecondary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.medium
                    }}>
                      {site.timezone}
                    </span>
                  </div>
                </div>

                {/* Action button with neon border animation */}
                <Link to={`/dash/${site.site_id}`} style={{ textDecoration: 'none' }}>
                  <button
                    className="neon-border-btn w-full flex items-center justify-center transition-all duration-300"
                    style={{
                      padding: `${THEME_CONFIG.SPACING.md} ${THEME_CONFIG.SPACING.lg}`,
                      border: `2px solid ${THEME_CONFIG.COLORS.textPrimary}`,
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      backgroundColor: 'transparent',
                      color: THEME_CONFIG.COLORS.textPrimary,
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body,
                      fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
                      fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
                      cursor: 'pointer',
                      minHeight: '44px',
                      position: 'relative',
                      zIndex: 1
                    }}
                    onMouseEnter={(e) => {
                      // Add blue hover class to parent card
                      const card = e.target.closest('.card-hover-effect');
                      if (card) {
                        card.classList.add('blue-hover');
                      }
                    }}
                    onMouseLeave={(e) => {
                      // Reset to original colors when not hovering
                      e.target.style.borderColor = THEME_CONFIG.COLORS.textPrimary;
                      e.target.style.color = THEME_CONFIG.COLORS.textPrimary;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0px)';
                      // Remove blue hover class from parent card
                      const card = e.target.closest('.card-hover-effect');
                      if (card) {
                        card.classList.remove('blue-hover');
                      }
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
                      <BarChart3 size={18} style={{ marginRight: '8px' }} />
                      View Dashboard
                    </span>
                  </button>
                </Link>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Manage;