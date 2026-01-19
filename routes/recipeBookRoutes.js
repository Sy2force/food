const express = require('express');
const router = express.Router();
const recipeBookController = require('../controllers/recipeBookController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { recipeBookSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/', auth, upload.single('coverImage'), validate(recipeBookSchema), recipeBookController.createRecipeBook);
router.get('/', recipeBookController.getAllRecipeBooks);
router.get('/my-recipe-books', auth, recipeBookController.getMyRecipeBooks);
router.get('/:id', recipeBookController.getRecipeBookById);
router.put('/:id', auth, upload.single('coverImage'), validate(recipeBookSchema), recipeBookController.updateRecipeBook);
router.delete('/:id', auth, recipeBookController.deleteRecipeBook);
router.post('/:id/like', auth, recipeBookController.likeRecipeBook);

module.exports = router;
