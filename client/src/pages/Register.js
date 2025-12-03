/**
 * Register Page Component
 *
 * Provides a registration form for new users.
 * Uses Bootstrap for styling and AuthContext for user registration.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  // Get auth context methods
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Prepare user data for API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      address: {
        street: formData.street || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined
      }
    };

    // Remove address if all fields are empty
    if (!formData.street && !formData.city && !formData.state && !formData.zipCode && !formData.country) {
      delete userData.address;
    }

    // Call register function from auth context
    const result = await register(userData);

    if (result.success) {
      // Redirect to dashboard on successful registration
      navigate('/dashboard');
    } else {
      // Show error message
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              {/* Page title */}
              <h2 className="text-center mb-4">Register</h2>

              {/* Error alert */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Registration form */}
              <form onSubmit={handleSubmit}>
                {/* Required fields section */}
                <h5 className="mb-3">Required Information</h5>

                {/* Name input */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password input */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password * (min 8 characters)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    disabled={loading}
                  />
                </div>

                {/* Confirm password input */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="8"
                    disabled={loading}
                  />
                </div>

                {/* Optional fields section */}
                <h5 className="mb-3 mt-4">Optional Information</h5>

                {/* Phone input */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1-234-567-8900"
                    disabled={loading}
                  />
                </div>

                {/* Address section */}
                <h6 className="mb-3">Address</h6>

                {/* Street input */}
                <div className="mb-3">
                  <label htmlFor="street" className="form-label">
                    Street
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* City and State row */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Zip code and Country row */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="form-label">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              {/* Link to login page */}
              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
