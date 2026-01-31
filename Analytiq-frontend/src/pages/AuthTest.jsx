import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthTest() {
  const { user, isAuthenticated, refreshUserToken } = useAuth();
  const [refreshResult, setRefreshResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualRefresh = async () => {
    setLoading(true);
    setRefreshResult(null);
    
    try {
      const result = await refreshUserToken();
      setRefreshResult(result);
    } catch (error) {
      setRefreshResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Test</h2>
          <p className="text-gray-600">Please log in to test authentication features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Authentication Test Page</h1>
          
          {/* User Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Current User Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-800">{user?.email || 'Not available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                  <p className="text-gray-800 font-mono text-sm">{user?.id || user?.userId || 'Not available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Authentication Status</label>
                  <p className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Token Stored</label>
                  <p className={`font-semibold ${localStorage.getItem('analytiq_token') ? 'text-green-600' : 'text-red-600'}`}>
                    {localStorage.getItem('analytiq_token') ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Token Management */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Token Management</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Refreshing...' : 'Manual Token Refresh'}
              </button>
              
              <button
                onClick={() => {
                  console.log('Current token:', localStorage.getItem('analytiq_token'));
                  console.log('Current user:', localStorage.getItem('analytiq_user'));
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Log Token to Console
              </button>
            </div>
          </div>

          {/* Refresh Result */}
          {refreshResult && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Last Refresh Result</h2>
              <div className={`p-4 rounded-lg ${
                refreshResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`font-semibold ${refreshResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {refreshResult.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
                {refreshResult.error && (
                  <p className="text-red-600 text-sm">{refreshResult.error}</p>
                )}
                {refreshResult.user && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Updated user data:</p>
                    <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                      {JSON.stringify(refreshResult.user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Token Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Token Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                const token = localStorage.getItem('analytiq_token');
                if (!token) {
                  return <p className="text-gray-600">No token found</p>;
                }

                try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  const expiry = new Date(payload.exp * 1000);
                  const now = new Date();
                  const timeUntilExpiry = expiry.getTime() - now.getTime();
                  const hoursUntilExpiry = Math.max(0, Math.floor(timeUntilExpiry / (1000 * 60 * 60)));
                  const minutesUntilExpiry = Math.max(0, Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60)));

                  return (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Token Expires</label>
                        <p className="text-gray-800">{expiry.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Time Until Expiry</label>
                        <p className={`font-semibold ${timeUntilExpiry > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {timeUntilExpiry > 0 
                            ? `${hoursUntilExpiry}h ${minutesUntilExpiry}m`
                            : 'Expired'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Token Subject</label>
                        <p className="text-gray-800">{payload.sub || 'Not specified'}</p>
                      </div>
                    </div>
                  );
                } catch (error) {
                  return <p className="text-red-600">Error parsing token: {error.message}</p>;
                }
              })()}
            </div>
          </div>

          {/* Authentication Features */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Authentication Features</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Automatic token validation on app startup</li>
                <li>✓ Automatic token refresh every 20 hours</li>
                <li>✓ Session persistence across browser reloads</li>
                <li>✓ Graceful token expiration handling</li>
                <li>✓ Manual token refresh capability</li>
                <li>✓ Backend validation using /api/validate endpoint</li>
                <li>✓ Enhanced error handling and recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthTest;