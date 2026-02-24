const nodemailer = require('nodemailer');

let transporter = null;

// Create email transporter only if credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Send password reset email
async function sendPasswordResetEmail(email, name, newPassword) {
  // If email is not configured, just log the password (for demo)
  if (!transporter) {
    console.log(`Email would be sent to ${email}: New password is ${newPassword}`);
    return { success: true };
  }
  const mailOptions = {
    from: `"Password Reset" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your New Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Successful</h2>
        <p>Hi ${name},</p>
        <p>Your password has been reset successfully. Here is your new password:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong style="font-size: 18px; color: #667eea;">${newPassword}</strong>
        </div>
        <p style="color: #666;">Please login with this password and change it immediately for security reasons.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this password reset, please contact support immediately.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendPasswordResetEmail };
