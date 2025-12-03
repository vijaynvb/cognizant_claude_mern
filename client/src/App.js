/**
 * App Component
 *
 * Main application component that sets up routing and layout.
 * Wraps the application with AuthProvider for authentication context.
 * Configures React Router for navigation between pages.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* Navigation bar */}
          <Navbar />

          {/* Main content area */}
          <main className="min-vh-100">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Default route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Catch-all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
