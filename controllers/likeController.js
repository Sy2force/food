const User = require('../models/User');
const Dish = require('../models/Dish');
const Recipe = require('../models/Recipe');
const RecipeBook = require('../models/RecipeBook');
const Post = require('../models/Post');

const modelMap = {
  dishes: Dish,
  recipes: Recipe,
  recipeBooks: RecipeBook,
  posts: Post
};

exports.toggleLike = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user._id;

    if (!modelMap[type]) {
      return res.status(400).json({ 
        error: 'Type invalide. Types autorisés: dishes, recipes, recipeBooks, posts' 
      });
    }

    const Model = modelMap[type];
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ error: 'Élément non trouvé' });
    }

    const user = await User.findById(userId);
    const hasLiked = user.likes[type].includes(id);

    if (hasLiked) {
      user.likes[type] = user.likes[type].filter(
        itemId => itemId.toString() !== id
      );

      if (item.likes) {
        item.likes = item.likes.filter(
          likeId => likeId.toString() !== userId.toString()
        );
      }

      await user.save();
      await item.save();

      return res.json({
        message: 'Like retiré',
        liked: false,
        likesCount: item.likes?.length || 0
      });
    } else {
      user.likes[type].push(id);

      if (item.likes) {
        item.likes.push(userId);
      }

      await user.save();
      await item.save();

      return res.json({
        message: 'Like ajouté',
        liked: true,
        likesCount: item.likes?.length || 0
      });
    }
  } catch (error) {
    console.error('Erreur toggle like:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('likes.dishes')
      .populate('likes.recipes')
      .populate('likes.recipeBooks')
      .populate('likes.posts');

    res.json({
      likes: user.likes
    });
  } catch (error) {
    console.error('Erreur get user likes:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkIfLiked = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user._id;

    if (!modelMap[type]) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const user = await User.findById(userId);
    const hasLiked = user.likes[type].includes(id);

    res.json({ liked: hasLiked });
  } catch (error) {
    console.error('Erreur check if liked:', error);
    res.status(500).json({ error: error.message });
  }
};
