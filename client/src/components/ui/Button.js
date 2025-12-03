/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 * Supports different styles (primary, secondary, success, danger, warning, info)
 * and sizes (small, medium, large).
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button component with customizable variants and sizes
 * @param {Object} props - Component props
 * @param {string} props.children - Button text content
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Button component
 */
function Button({
  children = 'Click Me',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  /**
   * Generate CSS class names based on props
   * @returns {string} Combined class names
   */
  const getClassNames = () => {
    const classes = [
      'ui-button',
      `ui-button--${variant}`,
      `ui-button--${size}`,
    ];

    if (fullWidth) {
      classes.push('ui-button--full-width');
    }

    if (disabled) {
      classes.push('ui-button--disabled');
    }

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  return (
    <button
      type={type}
      className={getClassNames()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default Button;
