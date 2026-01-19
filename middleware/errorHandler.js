const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.details || err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID invalide',
      details: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Doublon détecté',
      details: 'Cette valeur existe déjà dans la base de données'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne'
  });
};

module.exports = errorHandler;
