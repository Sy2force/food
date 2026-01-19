const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const auth = require('../middleware/auth');
const isBusiness = require('../middleware/isBusiness');
const validate = require('../middleware/validate');
const { dishSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/', auth, isBusiness, upload.single('image'), validate(dishSchema), dishController.createDish);
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.put('/:id', auth, upload.single('image'), validate(dishSchema), dishController.updateDish);
router.delete('/:id', auth, dishController.deleteDish);

module.exports = router;
