/**
 * Authentication Routes
 *
 * Handles user registration, login, and logout endpoints.
 * Implements the authentication endpoints from the OpenAPI specification.
 *
 * Routes:
 * - POST /api/auth/register - Register a new user
 * - POST /api/auth/login - Authenticate user and get token
 * - POST /api/auth/logout - Invalidate user token
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { userDB, tokenDB } = require('../utils/database');
const { generateToken, authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email, password, and name are required'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = userDB.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      phone,
      address
    });

    // Save user to database
    userDB.create(newUser);

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error registering user'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = userDB.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error logging in'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user by invalidating their token
 * Requires authentication
 */
router.post('/logout', authenticate, (req, res) => {
  try {
    // Invalidate the token
    tokenDB.invalidate(req.token);

    res.status(200).json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error logging out'
    });
  }
});

module.exports = router;
