/**
 * TodoItem Component
 *
 * Displays a single todo item in a card format.
 * Shows todo details and provides edit/delete actions.
 * Uses Bootstrap card styling.
 */

import React from 'react';

function TodoItem({ todo, onEdit, onDelete }) {
  /**
   * Get badge color based on priority
   * @param {string} priority - Todo priority
   * @returns {string} Bootstrap badge class
   */
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  /**
   * Get badge color based on status
   * @param {string} status - Todo status
   * @returns {string} Bootstrap badge class
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-primary';
      case 'pending':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        {/* Todo title */}
        <h5 className="card-title">{todo.title}</h5>

        {/* Status and Priority badges */}
        <div className="mb-2">
          <span className={`badge ${getStatusBadge(todo.status)} me-2`}>
            {todo.status}
          </span>
          <span className={`badge ${getPriorityBadge(todo.priority)}`}>
            {todo.priority}
          </span>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="card-text">{todo.description}</p>
        )}

        {/* Due date */}
        <p className="card-text">
          <small className="text-muted">
            Due: {formatDate(todo.dueDate)}
          </small>
        </p>
      </div>

      {/* Action buttons */}
      <div className="card-footer bg-transparent border-top-0">
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(todo)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
