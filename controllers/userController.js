const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadImage');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.validatedBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Connexion réussie',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites.restaurants')
      .populate('favorites.dishes')
      .populate('favorites.recipes');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'pseudo'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profil mis à jour',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const user = await User.findById(req.user._id);

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'avatars');
    
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      message: 'Avatar mis à jour',
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    user.avatar = '';
    user.avatarPublicId = '';
    await user.save();

    res.json({
      message: 'Avatar supprimé'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('favorites.restaurants')
      .populate('favorites.dishes')
      .populate('favorites.recipes');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { type, itemId } = req.body;
    const validTypes = ['restaurants', 'dishes', 'recipes'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.favorites[type].includes(itemId)) {
      user.favorites[type].push(itemId);
      await user.save();
    }

    res.json({
      message: 'Ajouté aux favoris',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { type, itemId } = req.body;
    const validTypes = ['restaurants', 'dishes', 'recipes', 'recipeBooks'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const user = await User.findById(req.user._id);
    user.favorites[type] = user.favorites[type].filter(
      id => id.toString() !== itemId
    );
    await user.save();

    res.json({
      message: 'Retiré des favoris',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites.restaurants')
      .populate('favorites.dishes')
      .populate('favorites.recipes')
      .populate('favorites.recipeBooks')
      .populate('likes.dishes')
      .populate('likes.recipes')
      .populate('likes.recipeBooks')
      .populate('likes.posts');

    const stats = {
      favoritesCount: {
        restaurants: user.favorites.restaurants.length,
        dishes: user.favorites.dishes.length,
        recipes: user.favorites.recipes.length,
        recipeBooks: user.favorites.recipeBooks.length,
        total: user.favorites.restaurants.length + 
               user.favorites.dishes.length + 
               user.favorites.recipes.length +
               user.favorites.recipeBooks.length
      },
      likesCount: {
        dishes: user.likes.dishes.length,
        recipes: user.likes.recipes.length,
        recipeBooks: user.likes.recipeBooks.length,
        posts: user.likes.posts.length,
        total: user.likes.dishes.length + 
               user.likes.recipes.length + 
               user.likes.recipeBooks.length +
               user.likes.posts.length
      },
      favorites: user.favorites,
      likes: user.likes
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
