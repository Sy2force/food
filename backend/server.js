const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow all for now or restrictive in prod
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Logger helper function
const logErrorToFile = (req, res, errorMessage) => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${dateStr}.log`);
  const logEntry = `[${date.toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Error: ${errorMessage}\n`;
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

// Logger middleware for errors >= 400
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) {
      // Try to parse the error message from the response body if it's JSON
      let errorMessage = 'Unknown error';
      try {
        const parsedData = JSON.parse(data);
        errorMessage = parsedData.message || JSON.stringify(parsedData);
      } catch (e) {
        errorMessage = data.toString();
      }
      logErrorToFile(req, res, errorMessage);
    }
    originalSend.call(this, data);
  };
  next();
});

app.use(morgan('dev'));

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Flavors of Israel API' });
});

// Routes from PDF
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/cards', require('./routes/card.routes'));

// Other routes (Project specific)
// app.use('/api/auth', require('./routes/auth.routes')); // Merged into users
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/dishes', require('./routes/dish.routes'));
app.use('/api/recipe-books', require('./routes/recipeBook.routes'));
app.use('/api/recipes', require('./routes/recipe.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/community-posts', require('./routes/communityPost.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
