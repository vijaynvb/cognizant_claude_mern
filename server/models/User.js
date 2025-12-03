/**
 * User Model
 *
 * Represents a user in the todo application with authentication capabilities.
 * Based on the OpenAPI specification User schema.
 *
 * Properties:
 * - id: Unique identifier for the user
 * - name: User's full name
 * - email: User's email address (used for authentication)
 * - password: Hashed password for authentication
 * - phone: Optional phone number
 * - address: Optional address object with street, city, state, zipCode, country
 * - createdAt: Timestamp when user was created
 * - updatedAt: Timestamp when user was last updated
 */

class User {
  /**
   * Create a new User instance
   * @param {Object} userData - User data object
   * @param {string} userData.id - Unique user ID
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - Hashed password
   * @param {string} [userData.phone] - User's phone number
   * @param {Object} [userData.address] - User's address
   */
  constructor({ id, name, email, password, phone, address }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone || null;
    this.address = address || null;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert user to plain object without password
   * @returns {Object} User object without sensitive data
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Update user fields
   * @param {Object} updates - Fields to update
   */
  update(updates) {
    // Update allowed fields
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.email !== undefined) this.email = updates.email;
    if (updates.phone !== undefined) this.phone = updates.phone;
    if (updates.address !== undefined) this.address = updates.address;
    if (updates.password !== undefined) this.password = updates.password;

    // Update timestamp
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = User;
