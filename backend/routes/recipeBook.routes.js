const express = require('express');
const router = express.Router();
const recipeBookController = require('../controllers/recipeBook.controller');
const { auth, isAdmin } = require('../middleware/auth');
const { validateRecipeBook } = require('../middleware/validation');

router.post('/', auth, isAdmin, validateRecipeBook, recipeBookController.createRecipeBook);
router.get('/', recipeBookController.getAllRecipeBooks);
router.get('/:id', recipeBookController.getRecipeBookById);
router.put('/:id', auth, isAdmin, validateRecipeBook, recipeBookController.updateRecipeBook);
router.delete('/:id', auth, isAdmin, recipeBookController.deleteRecipeBook);
router.post('/:id/like', auth, recipeBookController.likeRecipeBook);

module.exports = router;
