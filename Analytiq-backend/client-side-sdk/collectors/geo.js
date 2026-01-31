
/**
 * Geolocation collector
 * Collects user location from browser geolocation API only (no third-party fallback)
 */

/**
 * Get geolocation information (latitude and longitude only)
 * @param {Function} cb - Callback function to receive geo data
 */
export function getGeoInfo(cb) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        cb({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
      },
      function () {
        // User denied geolocation or error
        cb({ lat: 0, long: 0 });
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  } else {
    // No geolocation support
    cb({ lat: 0, long: 0 });
  }
}
