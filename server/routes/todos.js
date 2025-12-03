/**
 * Todo Routes
 *
 * Handles CRUD operations for todos.
 * Implements the todo endpoints from the OpenAPI specification.
 *
 * Routes:
 * - GET /api/todos - Get all todos for authenticated user (with filters)
 * - POST /api/todos - Create a new todo
 * - GET /api/todos/:id - Get a specific todo by ID
 * - PUT /api/todos/:id - Update a todo
 * - DELETE /api/todos/:id - Delete a todo
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { todoDB } = require('../utils/database');
const { authenticate } = require('../middleware/auth');
const Todo = require('../models/Todo');

const router = express.Router();

// All todo routes require authentication
router.use(authenticate);

/**
 * GET /api/todos
 * Get all todos for the authenticated user with optional filters and pagination
 */
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, page = 1, limit = 10 } = req.query;

    // Build filters object
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // Get todos from database with filters
    let todos = todoDB.findByUserId(userId, filters);

    // Calculate pagination
    const totalItems = todos.length;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 items per page
    const totalPages = Math.ceil(totalItems / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    // Apply pagination
    const paginatedTodos = todos.slice(startIndex, endIndex);

    // Return response with pagination info
    res.status(200).json({
      todos: paginatedTodos.map(todo => todo.toJSON()),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error retrieving todos'
    });
  }
});

/**
 * POST /api/todos
 * Create a new todo for the authenticated user
 */
router.post('/', (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, dueDate, status } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title is required'
      });
    }

    // Validate status if provided
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status. Must be one of: pending, in-progress, completed'
      });
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid priority. Must be one of: low, medium, high'
      });
    }

    // Create new todo
    const newTodo = new Todo({
      id: uuidv4(),
      userId,
      title,
      description,
      priority,
      dueDate,
      status
    });

    // Save todo to database
    todoDB.create(newTodo);

    // Return success response
    res.status(201).json({
      message: 'Todo created successfully',
      todo: newTodo.toJSON()
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error creating todo'
    });
  }
});

/**
 * GET /api/todos/:id
 * Get a specific todo by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find todo by ID
    const todo = todoDB.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Check if todo belongs to the authenticated user
    if (todo.userId !== userId) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Return todo
    res.status(200).json(todo.toJSON());
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error retrieving todo'
    });
  }
});

/**
 * PUT /api/todos/:id
 * Update a todo
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, dueDate, status } = req.body;

    // Find todo by ID
    const todo = todoDB.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Check if todo belongs to the authenticated user
    if (todo.userId !== userId) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Validate status if provided
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status. Must be one of: pending, in-progress, completed'
      });
    }

    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid priority. Must be one of: low, medium, high'
      });
    }

    // Update todo
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (status !== undefined) updates.status = status;

    todoDB.update(id, updates);

    // Return updated todo
    res.status(200).json({
      message: 'Todo updated successfully',
      todo: todo.toJSON()
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error updating todo'
    });
  }
});

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find todo by ID
    const todo = todoDB.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Check if todo belongs to the authenticated user
    if (todo.userId !== userId) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    }

    // Delete todo
    todoDB.delete(id);

    // Return success response
    res.status(200).json({
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error deleting todo'
    });
  }
});

module.exports = router;
