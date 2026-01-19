const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { recipeSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/', auth, upload.single('image'), validate(recipeSchema), recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/my-recipes', auth, recipeController.getMyRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', auth, upload.single('image'), validate(recipeSchema), recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);
router.post('/:id/like', auth, recipeController.likeRecipe);

module.exports = router;
