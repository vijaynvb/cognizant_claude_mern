/**
 * User Profile Routes
 *
 * Handles user profile management endpoints.
 * Implements the user profile endpoints from the OpenAPI specification.
 *
 * Routes:
 * - GET /api/users/profile - Get user profile
 * - PUT /api/users/profile - Update user profile
 * - DELETE /api/users/profile - Delete user account
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { userDB, todoDB } = require('../utils/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users/profile
 * Get the authenticated user's profile
 */
router.get('/profile', (req, res) => {
  try {
    // User is already attached to req by authenticate middleware
    res.status(200).json(req.user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error retrieving profile'
    });
  }
});

/**
 * PUT /api/users/profile
 * Update the authenticated user's profile
 */
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address,
      currentPassword,
      newPassword
    } = req.body;

    // If changing password, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Current password is required when changing password'
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Current password is incorrect'
        });
      }

      // Validate new password length
      if (newPassword.length < 8) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'New password must be at least 8 characters long'
        });
      }
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== req.user.email) {
      const existingUser = userDB.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email is already in use'
        });
      }
    }

    // Build updates object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;

    // Hash new password if provided
    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    userDB.update(userId, updates);

    // Return updated user
    res.status(200).json({
      message: 'Profile updated successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error updating profile'
    });
  }
});

/**
 * DELETE /api/users/profile
 * Delete the authenticated user's account and all associated data
 */
router.delete('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Validate password is provided
    if (!password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password is required for account deletion'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, req.user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid password'
      });
    }

    // Delete all user's todos
    todoDB.deleteByUserId(userId);

    // Delete user account
    userDB.delete(userId);

    // Return success response
    res.status(200).json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error deleting account'
    });
  }
});

module.exports = router;
