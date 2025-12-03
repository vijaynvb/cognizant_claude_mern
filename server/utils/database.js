/**
 * In-Memory Database
 *
 * Simple in-memory storage using arrays for users and todos.
 * This simulates a database without requiring external dependencies.
 *
 * Storage Structure:
 * - users: Array of User objects
 * - todos: Array of Todo objects
 * - invalidatedTokens: Set of invalidated JWT tokens (for logout functionality)
 */

const database = {
  // Array to store all users
  users: [],

  // Array to store all todos
  todos: [],

  // Set to store invalidated tokens (for logout)
  invalidatedTokens: new Set()
};

/**
 * Database helper functions for user operations
 */
const userDB = {
  /**
   * Find a user by email
   * @param {string} email - User's email
   * @returns {Object|undefined} User object or undefined
   */
  findByEmail: (email) => {
    return database.users.find(user => user.email === email);
  },

  /**
   * Find a user by ID
   * @param {string} id - User's ID
   * @returns {Object|undefined} User object or undefined
   */
  findById: (id) => {
    return database.users.find(user => user.id === id);
  },

  /**
   * Create a new user
   * @param {Object} user - User object
   * @returns {Object} Created user
   */
  create: (user) => {
    database.users.push(user);
    return user;
  },

  /**
   * Update a user
   * @param {string} id - User's ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated user or null
   */
  update: (id, updates) => {
    const user = database.users.find(u => u.id === id);
    if (user) {
      user.update(updates);
      return user;
    }
    return null;
  },

  /**
   * Delete a user
   * @param {string} id - User's ID
   * @returns {boolean} True if deleted, false otherwise
   */
  delete: (id) => {
    const index = database.users.findIndex(u => u.id === id);
    if (index !== -1) {
      database.users.splice(index, 1);
      return true;
    }
    return false;
  }
};

/**
 * Database helper functions for todo operations
 */
const todoDB = {
  /**
   * Find all todos for a user with optional filters
   * @param {string} userId - User's ID
   * @param {Object} filters - Optional filters (status, priority)
   * @returns {Array} Array of todos
   */
  findByUserId: (userId, filters = {}) => {
    let todos = database.todos.filter(todo => todo.userId === userId);

    // Apply status filter
    if (filters.status) {
      todos = todos.filter(todo => todo.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      todos = todos.filter(todo => todo.priority === filters.priority);
    }

    return todos;
  },

  /**
   * Find a todo by ID
   * @param {string} id - Todo's ID
   * @returns {Object|undefined} Todo object or undefined
   */
  findById: (id) => {
    return database.todos.find(todo => todo.id === id);
  },

  /**
   * Create a new todo
   * @param {Object} todo - Todo object
   * @returns {Object} Created todo
   */
  create: (todo) => {
    database.todos.push(todo);
    return todo;
  },

  /**
   * Update a todo
   * @param {string} id - Todo's ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated todo or null
   */
  update: (id, updates) => {
    const todo = database.todos.find(t => t.id === id);
    if (todo) {
      todo.update(updates);
      return todo;
    }
    return null;
  },

  /**
   * Delete a todo
   * @param {string} id - Todo's ID
   * @returns {boolean} True if deleted, false otherwise
   */
  delete: (id) => {
    const index = database.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      database.todos.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Delete all todos for a user
   * @param {string} userId - User's ID
   * @returns {number} Number of todos deleted
   */
  deleteByUserId: (userId) => {
    const initialLength = database.todos.length;
    database.todos = database.todos.filter(todo => todo.userId !== userId);
    return initialLength - database.todos.length;
  }
};

/**
 * Token management functions
 */
const tokenDB = {
  /**
   * Invalidate a token (for logout)
   * @param {string} token - JWT token
   */
  invalidate: (token) => {
    database.invalidatedTokens.add(token);
  },

  /**
   * Check if a token is invalidated
   * @param {string} token - JWT token
   * @returns {boolean} True if invalidated
   */
  isInvalidated: (token) => {
    return database.invalidatedTokens.has(token);
  }
};

module.exports = {
  database,
  userDB,
  todoDB,
  tokenDB
};
