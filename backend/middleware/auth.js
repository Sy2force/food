const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isBusiness = (req, res, next) => {
  if (!req.user.isBusiness && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Business account required.' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

const isOwnerOrAdmin = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      const isOwner = (resource.ownerId && resource.ownerId.toString() === req.userId.toString()) || 
                      (resource.user_id && resource.user_id.toString() === req.userId.toString());
      
      const isResourceAdmin = req.user.isAdmin;
      
      if (!isOwner && !isResourceAdmin) {
        return res.status(403).json({ message: 'Access denied. You are not the owner of this resource.' });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking ownership', error: error.message });
    }
  };
};

module.exports = { auth, isBusiness, isAdmin, isOwnerOrAdmin };
