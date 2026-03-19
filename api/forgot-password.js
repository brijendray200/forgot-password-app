const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const resetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  identifier: { type: String, required: true },
  type: { type: String, enum: ['email', 'phone'], required: true },
  requestedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', resetSchema);

function generatePassword(length = 12) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const all = upper + lower;
  let pwd = upper[Math.floor(Math.random() * upper.length)] + lower[Math.floor(Math.random() * lower.length)];
  for (let i = 2; i < length; i++) pwd += all[Math.floor(Math.random() * all.length)];
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    await connectDB();
    const { identifier, type } = req.body;

    if (!identifier || !type) {
      return res.status(400).json({ success: false, message: 'Email or phone is required' });
    }

    const query = type === 'email' ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, message: `No account found with this ${type}` });
    }

    // Check 1 request per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentReset = await PasswordReset.findOne({ userId: user._id, requestedAt: { $gte: oneDayAgo } });

    if (recentReset) {
      return res.status(429).json({ success: false, message: 'You can only request password reset once per day. Please try again later.' });
    }

    const newPassword = generatePassword(12);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await PasswordReset.create({ userId: user._id, identifier, type });

    // Log password for demo (in production send via email/SMS)
    console.log(`New password for ${identifier}: ${newPassword}`);

    res.json({
      success: true,
      message: `Password reset successful! New password sent to your ${type}.`,
      // Remove in production:
      newPassword
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Reset failed: ' + error.message });
  }
};
