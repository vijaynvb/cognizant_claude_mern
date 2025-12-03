/**
 * PrivateRoute Component
 *
 * Wrapper component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  // Get authentication status from context
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated, otherwise render children
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
