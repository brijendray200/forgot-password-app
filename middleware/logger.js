const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Request logger middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  const logMessage = `[${timestamp}] ${method} ${url} - IP: ${ip}\n`;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(logMessage.trim());
  }

  // Log to file
  const logFile = path.join(logsDir, `requests-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });

  next();
};

// Password reset logger
const logPasswordReset = (userId, identifier, type, success) => {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILED';
  const logMessage = `[${timestamp}] Password Reset ${status} - User: ${userId}, ${type}: ${identifier}\n`;

  const logFile = path.join(logsDir, `password-resets-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

module.exports = {
  requestLogger,
  logPasswordReset
};
