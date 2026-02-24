const { generateRandomPassword } = require('./passwordGenerator');

// In-memory storage for demo (use database in production)
const resetAttempts = new Map();

// Check if user can request password reset
function canRequestReset(identifier) {
  const lastAttempt = resetAttempts.get(identifier);
  
  if (!lastAttempt) return true;
  
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const timeSinceLastAttempt = Date.now() - lastAttempt;
  
  return timeSinceLastAttempt >= oneDayInMs;
}

// Handle forgot password request
async function handleForgotPassword(req, res) {
  const { identifier, type } = req.body; // identifier: email or phone, type: 'email' or 'phone'
  
  if (!identifier || !type) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email or phone number is required' 
    });
  }
  
  // Check if user can request reset
  if (!canRequestReset(identifier)) {
    return res.status(429).json({ 
      success: false, 
      message: 'You can only request password reset once per day. Please try again later.' 
    });
  }
  
  // Generate new password
  const newPassword = generateRandomPassword(12);
  
  // Record the attempt
  resetAttempts.set(identifier, Date.now());
  
  // TODO: Send password via email or SMS based on type
  // TODO: Update password in database
  
  // For demo purposes, return the password (never do this in production!)
  res.json({ 
    success: true, 
    message: `Password reset successful. New password sent to your ${type}.`,
    // Remove this in production - only for demo
    tempPassword: newPassword 
  });
}

module.exports = { handleForgotPassword };
