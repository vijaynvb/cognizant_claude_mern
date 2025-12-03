/**
 * Express Server - Todo Management API
 *
 * Main server file that initializes and configures the Express application.
 * Sets up middleware, routes, and starts the server.
 *
 * Features:
 * - RESTful API following OpenAPI specification
 * - JWT-based authentication
 * - In-memory database for users and todos
 * - CORS enabled for frontend communication
 * - Comprehensive error handling
 */

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');

// Create Express application
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */

// Enable CORS for all origins (in production, configure specific origins)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes Configuration
 */

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Todo Management API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      authentication: '/api/auth',
      todos: '/api/todos',
      userProfile: '/api/users/profile'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);      // Authentication endpoints
app.use('/api/todos', todoRoutes);     // Todo CRUD endpoints
app.use('/api/users', userRoutes);     // User profile endpoints

/**
 * Error Handling Middleware
 */

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Todo Management API Server');
  console.log('='.repeat(50));
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  Authentication:');
  console.log('    POST /api/auth/register - Register new user');
  console.log('    POST /api/auth/login - User login');
  console.log('    POST /api/auth/logout - User logout');
  console.log('');
  console.log('  Todos:');
  console.log('    GET /api/todos - Get all todos');
  console.log('    POST /api/todos - Create new todo');
  console.log('    GET /api/todos/:id - Get todo by ID');
  console.log('    PUT /api/todos/:id - Update todo');
  console.log('    DELETE /api/todos/:id - Delete todo');
  console.log('');
  console.log('  User Profile:');
  console.log('    GET /api/users/profile - Get user profile');
  console.log('    PUT /api/users/profile - Update user profile');
  console.log('    DELETE /api/users/profile - Delete user account');
  console.log('='.repeat(50));
});

// Export app for testing purposes
module.exports = app;
