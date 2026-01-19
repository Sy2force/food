const Recipe = require('../models/Recipe');
const RecipeBook = require('../models/RecipeBook');
const { uploadToCloudinary } = require('../utils/uploadImage');

exports.createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.validatedBody,
      author: req.user._id
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'recipes');
      recipeData.image = result.secure_url;
    }

    const recipe = new Recipe(recipeData);
    await recipe.save();

    if (recipeData.recipeBook) {
      await RecipeBook.findByIdAndUpdate(
        recipeData.recipeBook,
        { $push: { recipes: recipe._id } }
      );
    }

    res.status(201).json({
      message: 'Recette créée avec succès',
      recipe
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, region, difficulty, cacherout, search, recipeBook } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (region) query.region = region;
    if (difficulty) query.difficulty = difficulty;
    if (cacherout) query.cacherout = cacherout;
    if (recipeBook) query.recipeBook = recipeBook;
    if (search) query.$text = { $search: search };

    const recipes = await Recipe.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('recipeBook', 'title theme')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('recipeBook', 'title theme coverImage')
      .populate('likes', 'firstName lastName');

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    recipe.views += 1;
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updates = req.validatedBody;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'recipes');
      updates.image = result.secure_url;
    }

    Object.assign(recipe, updates);
    await recipe.save();

    res.json({
      message: 'Recette mise à jour',
      recipe
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    if (recipe.recipeBook) {
      await RecipeBook.findByIdAndUpdate(
        recipe.recipeBook,
        { $pull: { recipes: recipe._id } }
      );
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recette supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    const alreadyLiked = recipe.likes.includes(req.user._id);

    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      recipe.likes.push(req.user._id);
    }

    await recipe.save();

    res.json({
      message: alreadyLiked ? 'Like retiré' : 'Like ajouté',
      likes: recipe.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('recipeBook', 'title theme')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
