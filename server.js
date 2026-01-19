const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

const errorLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'error.log'),
  { flags: 'a' }
);

const logError = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: err.status || 500,
    message: err.message,
    stack: err.stack
  };
  errorLogStream.write(JSON.stringify(errorLog) + '\n');
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const dishRoutes = require('./routes/dishRoutes');
const recipeBookRoutes = require('./routes/recipeBookRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/recipe-books', recipeBookRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Flavors of Israel 🇮🇱' });
});

app.use((err, req, res, next) => {
  if (err.status >= 400) {
    logError(err, req);
  }
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erreur serveur interne',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
