const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { auth, isAdmin } = require('../middleware/auth');

// All routes require Auth and Admin role
router.use(auth, isAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/restaurants/pending', adminController.getPendingRestaurants);
router.post('/restaurants/:id/approve', adminController.approveRestaurant);
router.post('/restaurants/:id/reject', adminController.rejectRestaurant);
router.get('/moderation', adminController.getModerationQueue);
router.post('/moderation/:id/:action', adminController.resolveReport);

module.exports = router;
