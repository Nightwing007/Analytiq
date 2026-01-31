/**
 * App.jsx - Main Application Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import Auth from './pages/Auth.jsx';
import Landing from './pages/Landing.jsx';
import Manage from './pages/Manage.jsx';
import Dash from './pages/Dash.jsx';
import AuthTest from './pages/AuthTest.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './styles/globals.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/manage" element={
                <ProtectedRoute>
                  <Manage />
                </ProtectedRoute>
              } />
              
              <Route path="/dash/:siteId" element={
                <ProtectedRoute>
                  <Dash />
                </ProtectedRoute>
              } />
              
              <Route path="/auth-test" element={
                <ProtectedRoute>
                  <AuthTest />
                </ProtectedRoute>
              } />
              
              {/* Catch all route - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
