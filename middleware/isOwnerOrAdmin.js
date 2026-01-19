const isOwnerOrAdmin = (resourceOwnerField = 'author') => {
  return (req, res, next) => {
    const resourceOwnerId = req.resource?.[resourceOwnerField]?.toString() || 
                           req.params?.userId;

    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const isOwner = resourceOwnerId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Accès refusé. Vous devez être le propriétaire ou administrateur.' });
    }
  };
};

module.exports = isOwnerOrAdmin;
