const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logErrorToFile = (req, res, message = '') => {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${date}.log`);
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - IP: ${req.ip} - ${message}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

module.exports = { logErrorToFile };
