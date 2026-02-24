const twilio = require('twilio');

let client = null;

// Initialize Twilio client only if credentials are provided
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Send password reset SMS
async function sendPasswordResetSMS(phone, name, newPassword) {
  // If Twilio is not configured, just log the password (for demo)
  if (!client) {
    console.log(`SMS would be sent to ${phone}: New password is ${newPassword}`);
    return { success: true };
  }

  const message = `Hi ${name}, your password has been reset. New password: ${newPassword}. Please login and change it immediately.`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return { success: true };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendPasswordResetSMS };
