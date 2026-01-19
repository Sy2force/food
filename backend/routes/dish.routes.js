const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { auth, isBusiness } = require('../middleware/auth');
const { validateDish } = require('../middleware/validation');

router.post('/', auth, isBusiness, validateDish, dishController.createDish);
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.put('/:id', auth, isBusiness, validateDish, dishController.updateDish);
router.delete('/:id', auth, isBusiness, dishController.deleteDish);
router.post('/:id/like', auth, dishController.likeDish);

module.exports = router;
