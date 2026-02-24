const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
const daysToKeep = 7; // Keep logs for 7 days

function cleanupOldLogs() {
  if (!fs.existsSync(logsDir)) {
    console.log('Logs directory does not exist');
    return;
  }

  const files = fs.readdirSync(logsDir);
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtime.getTime();

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old log file: ${file}`);
      deletedCount++;
    }
  });

  console.log(`Cleanup complete. Deleted ${deletedCount} old log files.`);
}

cleanupOldLogs();
