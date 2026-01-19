const RecipeBook = require('../models/RecipeBook');
const { uploadToCloudinary } = require('../utils/uploadImage');

exports.createRecipeBook = async (req, res) => {
  try {
    const recipeBookData = {
      ...req.validatedBody,
      author: req.user._id
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'recipe-books');
      recipeBookData.coverImage = result.secure_url;
    }

    const recipeBook = new RecipeBook(recipeBookData);
    await recipeBook.save();

    res.status(201).json({
      message: 'Livre de recettes créé avec succès',
      recipeBook
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRecipeBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, theme, search } = req.query;
    const query = { isPublished: true };

    if (theme) query.theme = theme;
    if (search) query.$text = { $search: search };

    const recipeBooks = await RecipeBook.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('recipes')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await RecipeBook.countDocuments(query);

    res.json({
      recipeBooks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecipeBookById = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('recipes')
      .populate('likes', 'firstName lastName');

    if (!recipeBook) {
      return res.status(404).json({ error: 'Livre de recettes non trouvé' });
    }

    recipeBook.views += 1;
    await recipeBook.save();

    res.json(recipeBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id);

    if (!recipeBook) {
      return res.status(404).json({ error: 'Livre de recettes non trouvé' });
    }

    if (recipeBook.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updates = req.validatedBody;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'recipe-books');
      updates.coverImage = result.secure_url;
    }

    Object.assign(recipeBook, updates);
    await recipeBook.save();

    res.json({
      message: 'Livre de recettes mis à jour',
      recipeBook
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id);

    if (!recipeBook) {
      return res.status(404).json({ error: 'Livre de recettes non trouvé' });
    }

    if (recipeBook.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await RecipeBook.findByIdAndDelete(req.params.id);

    res.json({ message: 'Livre de recettes supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findById(req.params.id);

    if (!recipeBook) {
      return res.status(404).json({ error: 'Livre de recettes non trouvé' });
    }

    const alreadyLiked = recipeBook.likes.includes(req.user._id);

    if (alreadyLiked) {
      recipeBook.likes = recipeBook.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      recipeBook.likes.push(req.user._id);
    }

    await recipeBook.save();

    res.json({
      message: alreadyLiked ? 'Like retiré' : 'Like ajouté',
      likes: recipeBook.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRecipeBooks = async (req, res) => {
  try {
    const recipeBooks = await RecipeBook.find({ author: req.user._id })
      .populate('recipes')
      .sort({ createdAt: -1 });

    res.json(recipeBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
