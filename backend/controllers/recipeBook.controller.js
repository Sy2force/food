const RecipeBook = require('../models/RecipeBook');
const Recipe = require('../models/Recipe');

exports.createRecipeBook = async (req, res) => {
  try {
    const recipeBook = new RecipeBook(req.body);
    await recipeBook.save();
    
    res.status(201).json({
      message: 'Recipe book created successfully',
      recipeBook
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe book', error: error.message });
  }
};

exports.getAllRecipeBooks = async (req, res) => {
  try {
    const { theme, page = 1, limit = 20 } = req.query;
    
    const filter = { isPublished: true };
    if (theme) filter.theme = theme;
    
    const skip = (page - 1) * limit;
    
    const recipeBooks = await RecipeBook.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await RecipeBook.countDocuments(filter);
    
    res.json({
      recipeBooks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe books', error: error.message });
  }
};

exports.getRecipeBookById = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id);
    
    if (!recipeBook) {
      return res.status(404).json({ message: 'Recipe book not found' });
    }
    
    const recipes = await Recipe.find({ bookId: recipeBook._id });
    
    res.json({
      recipeBook,
      recipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe book', error: error.message });
  }
};

exports.updateRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipeBook) {
      return res.status(404).json({ message: 'Recipe book not found' });
    }
    
    res.json({
      message: 'Recipe book updated successfully',
      recipeBook
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe book', error: error.message });
  }
};

exports.deleteRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findByIdAndDelete(req.params.id);
    
    if (!recipeBook) {
      return res.status(404).json({ message: 'Recipe book not found' });
    }
    
    await Recipe.deleteMany({ bookId: recipeBook._id });
    
    res.json({ message: 'Recipe book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe book', error: error.message });
  }
};

exports.likeRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id);
    if (!recipeBook) {
      return res.status(404).json({ message: 'Recipe book not found' });
    }
    
    const likeIndex = recipeBook.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      recipeBook.likes.splice(likeIndex, 1);
    } else {
      recipeBook.likes.push(req.userId);
    }
    
    await recipeBook.save();
    
    res.json({
      message: likeIndex > -1 ? 'Recipe book unliked' : 'Recipe book liked',
      likes: recipeBook.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking recipe book', error: error.message });
  }
};
