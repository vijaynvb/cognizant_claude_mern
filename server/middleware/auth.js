/**
 * Authentication Middleware
 *
 * Middleware for protecting routes with JWT authentication.
 * Verifies the Bearer token in the Authorization header and
 * attaches the authenticated user to the request object.
 */

const jwt = require('jsonwebtoken');
const { userDB, tokenDB } = require('../utils/database');

// Secret key for JWT - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and has Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required or invalid token'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Check if token has been invalidated (logged out)
    if (tokenDB.isInvalidated(token)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has been invalidated. Please login again.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID from token payload
    const user = userDB.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    // Attach user and token to request object for use in route handlers
    req.user = user;
    req.token = token;

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired'
      });
    }

    // Handle other errors
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error'
    });
  }
};

/**
 * Generate JWT token for a user
 *
 * @param {string} userId - User's ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

module.exports = {
  authenticate,
  generateToken,
  JWT_SECRET
};
