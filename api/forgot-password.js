const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  const db = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = db;
  return db;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  identifier: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', ResetSchema);

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

    await PasswordReset.create({ userId: user._id, identifier });

    // Send email if type is email
    if (type === 'email') {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"Password Reset" <${process.env.EMAIL_USER}>`,
        to: identifier,
        subject: 'Your New Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">Password Reset Successful</h2>
            <p>Hi ${user.name},</p>
            <p>Your new password is:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align:center;">
              <strong style="font-size: 22px; color: #667eea; letter-spacing: 2px;">${newPassword}</strong>
            </div>
            <p style="color: #666;">Please login and change your password immediately.</p>
          </div>
        `
      });
    }

    res.json({
      success: true,
      message: `Password reset successful! New password sent to your ${type}.`
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Reset failed: ' + error.message });
  }
};
