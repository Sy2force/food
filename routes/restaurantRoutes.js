const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const isBusiness = require('../middleware/isBusiness');
const validate = require('../middleware/validate');
const { restaurantSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/', auth, isBusiness, upload.single('logo'), validate(restaurantSchema), restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.get('/my-restaurants', auth, isBusiness, restaurantController.getMyRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', auth, upload.single('logo'), validate(restaurantSchema), restaurantController.updateRestaurant);
router.delete('/:id', auth, restaurantController.deleteRestaurant);

module.exports = router;
