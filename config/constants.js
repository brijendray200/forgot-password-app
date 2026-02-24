// Application constants
module.exports = {
  PASSWORD_RESET_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PASSWORD_LENGTH: 12,
  PASSWORD_MIN_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW: 15 * 60 * 1000, // 15 minutes
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },

  // Error Messages
  ERRORS: {
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    RATE_LIMIT_EXCEEDED: 'You can only request password reset once per day',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error'
  },

  // Success Messages
  SUCCESS: {
    REGISTRATION: 'User registered successfully',
    LOGIN: 'Login successful',
    PASSWORD_RESET: 'Password reset successful',
    LOGOUT: 'Logout successful'
  }
};
