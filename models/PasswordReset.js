const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
});

// Index for faster queries
passwordResetSchema.index({ userId: 1, expiresAt: 1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
