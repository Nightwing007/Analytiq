/**
 * Device information collector
 * Collects user agent, platform, device type, screen info, and browser details
 */

/**
 * Parse user agent to extract browser and OS
 * @param {string} ua - User agent string
 * @returns {Object} { browser: string, os: string }
 */
function parseBrowserInfo(ua) {
  var browser = 'Unknown';
  var os = 'Unknown';
  
  // Browser detection
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
  } else if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('Edg') > -1) {
    browser = 'Edge';
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    browser = 'Opera';
  }
  
  // OS detection
  if (ua.indexOf('Windows') > -1) {
    os = 'Windows';
  } else if (ua.indexOf('Mac') > -1) {
    os = 'macOS';
  } else if (ua.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    os = 'Android';
  } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
    os = 'iOS';
  }
  
  return { browser, os };
}

/**
 * Collect comprehensive device information
 * @returns {Object} Device data including user agent, platform, device type, screen, browser, OS
 */
export function getDeviceInfo() {
  var ua = navigator.userAgent;
  var platform = navigator.platform;
  var width = window.screen.width;
  var height = window.screen.height;
  var deviceType = /Mobi|Android/i.test(ua) 
    ? (/(Tablet|iPad)/i.test(ua) ? 'tablet' : 'mobile') 
    : 'desktop';
  var browserInfo = parseBrowserInfo(ua);
  
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var downlink = conn ? conn.downlink : undefined;
  var rtt = conn ? conn.rtt : undefined;
  
  return {
    user_agent: ua,
    platform: platform,
    device_type: deviceType,
    screen: width + 'x' + height,
    screen_width: width,
    screen_height: height,
    language: navigator.language || navigator.userLanguage,
    browser: browserInfo.browser,
    os: browserInfo.os,
    downlink_mbps: downlink,
    rtt_ms: rtt
  };
}
