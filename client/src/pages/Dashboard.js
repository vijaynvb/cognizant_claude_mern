/**
 * Dashboard Page Component
 *
 * Main page for authenticated users to manage their todos.
 * Provides CRUD functionality for todos with filtering options.
 * Uses Bootstrap for styling and Axios for API calls.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';

function Dashboard() {
  // Get auth context
  const { user } = useAuth();

  // State for todos and UI
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  /**
   * Fetch todos from API
   */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query params from filters
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const response = await todoAPI.getAll(params);
      setTodos(response.data.todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos on component mount and when filters change
  useEffect(() => {
    fetchTodos();
  }, [filters]);

  /**
   * Handle filter changes
   * @param {Event} e - Select change event
   */
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle creating a new todo
   */
  const handleCreate = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  /**
   * Handle editing a todo
   * @param {Object} todo - Todo to edit
   */
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  /**
   * Handle deleting a todo
   * @param {string} id - Todo ID to delete
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoAPI.delete(id);
      // Refresh todos list
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('Failed to delete todo. Please try again.');
    }
  };

  /**
   * Handle form submission (create or update)
   */
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTodo(null);
    // Refresh todos list
    fetchTodos();
  };

  /**
   * Handle form cancel
   */
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
    <div className="container mt-4">
      {/* Page header */}
      <div className="row mb-4">
        <div className="col">
          <h2>Welcome, {user?.name}!</h2>
          <p className="text-muted">Manage your todos</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={showForm}
          >
            + Create New Todo
          </button>
        </div>
      </div>

      {/* Todo form (shown when creating or editing) */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <TodoForm
              todo={editingTodo}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row">
            {/* Status filter */}
            <div className="col-md-6">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority filter */}
            <div className="col-md-6">
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                className="form-select"
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Todos list */}
      {!loading && (
        <div className="row">
          {todos.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No todos found. Create your first todo to get started!
              </div>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="col-md-6 col-lg-4 mb-3">
                <TodoItem
                  todo={todo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
