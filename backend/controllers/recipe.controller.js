const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    
    res.status(201).json({
      message: 'Recipe created successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { bookId, difficulty, isVegetarian, isVegan, page = 1, limit = 12 } = req.query;
    
    const filter = {};
    if (bookId) filter.bookId = bookId;
    if (difficulty) filter.difficulty = difficulty;
    if (isVegetarian) filter.isVegetarian = isVegetarian === 'true';
    if (isVegan) filter.isVegan = isVegan === 'true';
    
    const skip = (page - 1) * limit;
    
    const recipes = await Recipe.find(filter)
      .populate('bookId', 'title coverImage theme')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Recipe.countDocuments(filter);
    
    res.json({
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('bookId', 'title subtitle coverImage theme author')
      .populate('likes', 'name avatar')
      .populate('savedBy', 'name avatar');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json({
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    await User.updateMany(
      { favoriteRecipes: recipe._id },
      { $pull: { favoriteRecipes: recipe._id } }
    );
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const likeIndex = recipe.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      recipe.likes.splice(likeIndex, 1);
    } else {
      recipe.likes.push(req.userId);
    }
    
    await recipe.save();
    
    res.json({
      message: likeIndex > -1 ? 'Recipe unliked' : 'Recipe liked',
      likes: recipe.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const savedIndex = recipe.savedBy.indexOf(req.userId);
    
    if (savedIndex > -1) {
      recipe.savedBy.splice(savedIndex, 1);
      await User.findByIdAndUpdate(req.userId, {
        $pull: { favoriteRecipes: recipe._id }
      });
    } else {
      recipe.savedBy.push(req.userId);
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { favoriteRecipes: recipe._id }
      });
    }
    
    await recipe.save();
    
    res.json({
      message: savedIndex > -1 ? 'Recipe removed from favorites' : 'Recipe saved to favorites',
      isSaved: savedIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving recipe', error: error.message });
  }
};
