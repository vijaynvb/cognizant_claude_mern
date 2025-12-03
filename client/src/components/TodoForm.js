/**
 * TodoForm Component
 *
 * Form for creating or editing a todo.
 * Handles both create and update operations based on whether a todo is provided.
 * Uses Bootstrap form styling.
 */

import React, { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';

function TodoForm({ todo, onSubmit, onCancel }) {
  // Determine if we're editing or creating
  const isEditing = !!todo;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Initialize form with todo data if editing
   */
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        status: todo.status || 'pending',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
      });
    }
  }, [todo]);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const todoData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      if (isEditing) {
        // Update existing todo
        await todoAPI.update(todo.id, todoData);
      } else {
        // Create new todo
        await todoAPI.create(todoData);
      }

      // Call onSubmit callback to refresh parent component
      onSubmit();
    } catch (err) {
      console.error('Error saving todo:', err);
      setError(err.response?.data?.message || 'Failed to save todo. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form title */}
      <h4 className="mb-3">{isEditing ? 'Edit Todo' : 'Create New Todo'}</h4>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Todo form */}
      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Description textarea */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Status and Priority row */}
        <div className="row">
          {/* Status select */}
          <div className="col-md-6 mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority select */}
          <div className="col-md-6 mb-3">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              className="form-select"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due date input */}
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Action buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Todo' : 'Create Todo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
