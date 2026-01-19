const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const isBusiness = require('../middleware/isBusiness');

router.get('/stats', auth, isBusiness, dashboardController.getBusinessStats);
router.get('/restaurant/:restaurantId/stats', auth, isBusiness, dashboardController.getRestaurantStats);

module.exports = router;
