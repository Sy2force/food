const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { auth, isBusiness, isOwnerOrAdmin } = require('../middleware/auth');
const { validateRestaurant } = require('../middleware/validation');
const Restaurant = require('../models/Restaurant');

router.post('/', auth, isBusiness, validateRestaurant, restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.get('/my-restaurants', auth, isBusiness, restaurantController.getMyRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', auth, isBusiness, isOwnerOrAdmin(Restaurant), validateRestaurant, restaurantController.updateRestaurant);
router.delete('/:id', auth, isBusiness, isOwnerOrAdmin(Restaurant), restaurantController.deleteRestaurant);

module.exports = router;
