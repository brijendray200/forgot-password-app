const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { generateRandomPassword } = require('../utils/passwordGenerator');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { sendPasswordResetSMS } = require('../utils/smsService');

// Check if user can request password reset (once per day)
async function canRequestReset(userId) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const recentReset = await PasswordReset.findOne({
    userId,
    requestedAt: { $gte: oneDayAgo }
  });
  
  return !recentReset;
}

// Handle forgot password request
async function handleForgotPassword(req, res) {
  try {
    const { identifier, type } = req.body;
    
    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }
    
    // Find user by email or phone
    const query = type === 'email' ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No account found with this ${type}`
      });
    }
    
    // Check if user can request reset
    const canReset = await canRequestReset(user._id);
    
    if (!canReset) {
      return res.status(429).json({
        success: false,
        message: 'You can only request password reset once per day. Please try again later.'
      });
    }
    
    // Generate new password
    const newPassword = generateRandomPassword(12);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    // Record the reset attempt
    await PasswordReset.create({
      userId: user._id,
      identifier,
      type
    });
    
    // Send password via email or SMS
    let sendResult;
    if (type === 'email') {
      sendResult = await sendPasswordResetEmail(user.email, user.name, newPassword);
    } else {
      sendResult = await sendPasswordResetSMS(user.phone, user.name, newPassword);
    }
    
    if (!sendResult.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to send ${type}. Please try again later.`
      });
    }
    
    res.json({
      success: true,
      message: `Password reset successful! New password has been sent to your ${type}.`
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
}

module.exports = { handleForgotPassword };
