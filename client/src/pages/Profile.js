/**
 * Profile Page Component
 *
 * Allows users to view and update their profile information.
 * Provides functionality to update profile details and delete account.
 * Uses Bootstrap for styling.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

function Profile() {
  // Get auth context
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  /**
   * Handle password input changes
   * @param {Event} e - Input change event
   */
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  /**
   * Handle profile update submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare update data
      const updates = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: {
          street: formData.street || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode || null,
          country: formData.country || null
        }
      };

      // Include password if changing
      if (showPasswordForm && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }

        if (passwordData.newPassword.length < 8) {
          setError('New password must be at least 8 characters long');
          setLoading(false);
          return;
        }

        updates.currentPassword = passwordData.currentPassword;
        updates.newPassword = passwordData.newPassword;
      }

      const response = await userAPI.updateProfile(updates);
      updateUser(response.data.user);

      setSuccess('Profile updated successfully');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Password is required to delete account');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userAPI.deleteAccount(deletePassword);
      alert('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-5">
              {/* Page title */}
              <h2 className="mb-4">My Profile</h2>

              {/* Success alert */}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {/* Error alert */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Profile form */}
              <form onSubmit={handleSubmit}>
                {/* Basic information section */}
                <h5 className="mb-3">Basic Information</h5>

                {/* Name input */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
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
                    Email
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
                    disabled={loading}
                  />
                </div>

                {/* Address section */}
                <h5 className="mb-3 mt-4">Address</h5>

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

                {/* Password change section */}
                <h5 className="mb-3 mt-4">Change Password</h5>
                <button
                  type="button"
                  className="btn btn-outline-secondary mb-3"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  disabled={loading}
                >
                  {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
                </button>

                {showPasswordForm && (
                  <div>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        New Password (min 8 characters)
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        minLength="8"
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmNewPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        minLength="8"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>

              {/* Delete account section */}
              <div className="mt-5 pt-4 border-top">
                <h5 className="text-danger mb-3">Danger Zone</h5>
                {!showDeleteConfirm ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="card border-danger">
                    <div className="card-body">
                      <h6 className="card-title text-danger">
                        Confirm Account Deletion
                      </h6>
                      <p className="card-text">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <div className="mb-3">
                        <label htmlFor="deletePassword" className="form-label">
                          Enter your password to confirm
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="deletePassword"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                            setError('');
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={handleDeleteAccount}
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Permanently Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
