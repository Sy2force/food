const isBusiness = (req, res, next) => {
  if (req.user && (req.user.role === 'business' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé. Compte business requis.' });
  }
};

module.exports = isBusiness;
