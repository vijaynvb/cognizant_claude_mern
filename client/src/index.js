/**
 * Application Entry Point
 *
 * Main entry file that renders the React application.
 * Mounts the App component to the root DOM element.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get root element from HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
