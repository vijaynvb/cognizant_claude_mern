/**
 * Todo Model
 *
 * Represents a todo item in the application.
 * Based on the OpenAPI specification Todo schema.
 *
 * Properties:
 * - id: Unique identifier for the todo
 * - userId: ID of the user who owns this todo
 * - title: Todo title (required)
 * - description: Detailed description of the todo
 * - status: Current status (pending, in-progress, completed)
 * - priority: Priority level (low, medium, high)
 * - dueDate: Optional due date for the todo
 * - createdAt: Timestamp when todo was created
 * - updatedAt: Timestamp when todo was last updated
 */

class Todo {
  /**
   * Create a new Todo instance
   * @param {Object} todoData - Todo data object
   * @param {string} todoData.id - Unique todo ID
   * @param {string} todoData.userId - Owner user ID
   * @param {string} todoData.title - Todo title
   * @param {string} [todoData.description] - Todo description
   * @param {string} [todoData.status='pending'] - Todo status
   * @param {string} [todoData.priority='medium'] - Todo priority
   * @param {string} [todoData.dueDate] - Due date in ISO format
   */
  constructor({ id, userId, title, description, status, priority, dueDate }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description || '';
    this.status = status || 'pending';
    this.priority = priority || 'medium';
    this.dueDate = dueDate || null;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert todo to plain object
   * @returns {Object} Todo object
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Update todo fields
   * @param {Object} updates - Fields to update
   */
  update(updates) {
    // Update allowed fields
    if (updates.title !== undefined) this.title = updates.title;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.status !== undefined) this.status = updates.status;
    if (updates.priority !== undefined) this.priority = updates.priority;
    if (updates.dueDate !== undefined) this.dueDate = updates.dueDate;

    // Update timestamp
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Todo;
