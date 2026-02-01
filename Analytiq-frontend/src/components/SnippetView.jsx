import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { THEME_CONFIG } from './config';

const SnippetView = ({ siteId, siteUrl, snippet: providedSnippet, verificationStatus, onVerify }) => {
  const [copied, setCopied] = useState(false);
  const electricBlue = '#0066FF';
  const darkerBlue = '#0052CC';

  // Use provided snippet from API response, or fallback to constructed one
  const snippet = providedSnippet || `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://localhost:8000/analytics-client.js';
  script.setAttribute('data-site-id', '${siteId}');
  script.async = true;
  document.head.appendChild(script);
})();
</script>`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.h4,
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
          fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
          color: THEME_CONFIG.COLORS.textPrimary,
          marginBottom: '8px'
        }}>
          Installation Code
        </h3>
        <p style={{
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textSecondary
        }}>
          Copy and paste this code into the head section of your website:
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <pre style={{
          backgroundColor: '#1a1a1a',
          padding: '16px',
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          fontSize: '13px',
          overflowX: 'auto',
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
          fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.monospace,
          color: '#e0e0e0',
          lineHeight: '1.6'
        }}>
          <code>{snippet}</code>
        </pre>

        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '8px',
            backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
            borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
            border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = THEME_CONFIG.COLORS.backgroundPrimary;
            e.target.style.borderColor = electricBlue;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = THEME_CONFIG.COLORS.backgroundSecondary;
            e.target.style.borderColor = THEME_CONFIG.COLORS.borderPrimary;
          }}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check style={{ width: '16px', height: '16px', color: '#00ff88' }} />
          ) : (
            <Copy style={{ width: '16px', height: '16px', color: THEME_CONFIG.COLORS.textSecondary }} />
          )}
        </button>
      </div>

      <div style={{
        padding: '16px',
        borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
        backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
        border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
      }}>
        <h4 style={{
          fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
          fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
          color: electricBlue,
          marginBottom: '8px',
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
        }}>
          Installation Instructions:
        </h4>
        <ol style={{
          fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
          color: THEME_CONFIG.COLORS.textPrimary,
          paddingLeft: '20px',
          lineHeight: '1.8'
        }}>
          <li>Copy the code above</li>
          <li>Paste it into the head section of every page you want to track</li>
          <li>Save and publish your changes</li>
          <li>Analytics data will start appearing within a few minutes</li>
        </ol>
      </div>

      {siteUrl && (
        <div style={{
          padding: '16px',
          borderRadius: THEME_CONFIG.BORDER_RADIUS.medium,
          backgroundColor: THEME_CONFIG.COLORS.backgroundSecondary,
          border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '8px' 
          }}>
            <h4 style={{
              fontWeight: THEME_CONFIG.TYPOGRAPHY.fontWeight.semibold,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary,
              color: THEME_CONFIG.COLORS.textPrimary,
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.body
            }}>
              Site Information:
            </h4>
            {verificationStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {verificationStatus.loading ? (
                  <span style={{
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    color: electricBlue,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    Verifying...
                  </span>
                ) : verificationStatus.verified ? (
                  <span style={{
                    fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                    color: '#00ff88',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check style={{ width: '12px', height: '12px' }} /> Verified
                  </span>
                ) : (
                  <button
                    onClick={onVerify}
                    style={{
                      fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
                      padding: '4px 8px',
                      backgroundColor: electricBlue,
                      color: '#FFFFFF',
                      borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = darkerBlue;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = electricBlue;
                    }}
                  >
                    Verify Now
                  </button>
                )}
              </div>
            )}
          </div>
          <p style={{
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
            color: THEME_CONFIG.COLORS.textSecondary,
            marginBottom: '4px'
          }}>
            <strong style={{ color: THEME_CONFIG.COLORS.textPrimary }}>Site URL:</strong> {siteUrl}
          </p>
          <p style={{
            fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
            color: THEME_CONFIG.COLORS.textSecondary,
            fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.monospace
          }}>
            <strong style={{ 
              color: THEME_CONFIG.COLORS.textPrimary,
              fontFamily: THEME_CONFIG.TYPOGRAPHY.fontFamily.primary 
            }}>
              Site ID:
            </strong> {siteId}
          </p>
          {verificationStatus?.error && (
            <p style={{
              marginTop: '8px',
              fontSize: THEME_CONFIG.TYPOGRAPHY.fontSize.bodySmall,
              color: '#ff4444',
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              padding: '8px',
              borderRadius: THEME_CONFIG.BORDER_RADIUS.small,
              border: '1px solid rgba(255, 68, 68, 0.3)'
            }}>
              <strong>Verification Error:</strong> {verificationStatus.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SnippetView;
