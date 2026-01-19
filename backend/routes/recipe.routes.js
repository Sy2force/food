const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { auth, isAdmin } = require('../middleware/auth');
const { validateRecipe } = require('../middleware/validation');

router.post('/', auth, isAdmin, validateRecipe, recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', auth, isAdmin, validateRecipe, recipeController.updateRecipe);
router.delete('/:id', auth, isAdmin, recipeController.deleteRecipe);
router.post('/:id/like', auth, recipeController.likeRecipe);
router.post('/:id/save', auth, recipeController.saveRecipe);

module.exports = router;
