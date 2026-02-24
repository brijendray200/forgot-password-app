// Validation middleware
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegistration = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/Phone and password are required'
    });
  }

  next();
};

const validateForgotPassword = (req, res, next) => {
  const { identifier, type } = req.body;

  if (!identifier || !type) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and type are required'
    });
  }

  if (type === 'email' && !validateEmail(identifier)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (type === 'phone' && !validatePhone(identifier)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateForgotPassword
};
