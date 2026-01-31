/**
 * Geolocation collector
 * Collects user location from browser geolocation API and IP-based fallback
 */

/**
 * Get geolocation information with IP-based fallback
 * @param {Function} cb - Callback function to receive geo data
 */
export function getGeoInfo(cb) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;
        
        // Try to get city/country info from a free geolocation API
        try {
          fetch('https://ipapi.co/json/')
            .then(function(response) { return response.json(); })
            .then(function(data) {
              cb({
                lat: lat,
                long: long,
                city: data.city || 'Unknown',
                country: data.country_name || 'Unknown',
                region: data.region || 'Unknown'
              });
            })
            .catch(function() {
              // Fallback to just coordinates
              cb({lat: lat, long: long, city: 'Unknown', country: 'Unknown'});
            });
        } catch(e) {
          // Fallback to just coordinates
          cb({lat: lat, long: long, city: 'Unknown', country: 'Unknown'});
        }
      },
      function() {
        // User denied geolocation, try IP-based location as fallback
        fetchIPLocation(cb);
      },
      {timeout: 5000, enableHighAccuracy: false}
    );
  } else {
    // No geolocation support, try IP-based location
    fetchIPLocation(cb);
  }
}

/**
 * Fetch IP-based location as fallback
 * @param {Function} cb - Callback function to receive geo data
 */
function fetchIPLocation(cb) {
  try {
    fetch('https://ipapi.co/json/')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        cb({
          lat: data.latitude || 0,
          long: data.longitude || 0,
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown'
        });
      })
      .catch(function() {
        cb({lat: 0, long: 0, city: 'Unknown', country: 'Unknown'});
      });
  } catch(e) {
    cb({lat: 0, long: 0, city: 'Unknown', country: 'Unknown'});
  }
}
