const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId, isAdmin, isBusiness) => {
  return jwt.sign({ _id: userId, isAdmin, isBusiness }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// POST /users - Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, isBusiness } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = new User({
      name,
      email,
      password,
      isBusiness: isBusiness || false
    });
    
    await user.save();
    
    // According to PDF, POST /users is Public "Inscription". 
    // Usually returns user data or token. Let's return what auth.controller did.
    const token = generateToken(user._id, user.isAdmin, user.isBusiness);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// POST /users/login - Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.isLocked()) {
      return res.status(423).json({ 
        message: 'Account locked due to too many failed login attempts. Please try again later.',
        lockUntil: user.lockUntil
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    
    const token = generateToken(user._id, user.isAdmin, user.isBusiness);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// GET /users/profile - Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('favoriteRecipes')
      .populate('likedDishes');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// GET /users - Admin only
exports.getAllUsers = async (req, res) => {
  try {
    // Pagination optional but good practice
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// GET /users/:id - Self or Admin
exports.getUserById = async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favoriteRecipes')
      .populate('likedDishes');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// PUT /users/:id - Self
exports.updateUser = async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }

    const { password, isAdmin, isBusiness, ...updateData } = req.body;
    // Prevent updating password directly here if strictly following "Modify profile" usually implies names/details.
    // If password update is allowed via this route, it should be hashed. User model pre-save hooks handle hashing if using .save(), but findByIdAndUpdate bypasses middleware unless careful.
    // The previous implementation used findByIdAndUpdate. 
    // To be safe and simple, let's allow updating name, avatar, etc.
    // If password is sent, we might need to handle it.
    
    // PDF says "Modifier profil utilisateur". 
    // Let's exclude password/roles from this general update to stay safe, unless specified otherwise.
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// PATCH /users/:id - Self (Modifier isBusiness)
exports.updateIsBusiness = async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own status.' });
    }

    const { isBusiness } = req.body;
    if (typeof isBusiness !== 'boolean') {
      return res.status(400).json({ message: 'isBusiness must be a boolean' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBusiness },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating business status', error: error.message });
  }
};

// DELETE /users/:id - Self or Admin
exports.deleteUser = async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'favoriteRecipes',
        populate: { path: 'bookId', select: 'title coverImage' }
      })
      .populate({
        path: 'likedDishes',
        populate: { path: 'restaurantId', select: 'name city' }
      });
    
    res.json({
      favoriteRecipes: user.favoriteRecipes,
      likedDishes: user.likedDishes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (user.isBusiness) {
      // Get all restaurants owned by the user
      const restaurants = await Restaurant.find({ ownerId: userId });
      const restaurantIds = restaurants.map(r => r._id);
      
      // Get all dishes from these restaurants
      const dishes = await Dish.find({ restaurantId: { $in: restaurantIds } });
      
      // Calculate stats
      const totalRestaurants = restaurants.length;
      const totalDishes = dishes.length;
      const totalLikes = dishes.reduce((acc, dish) => acc + (dish.likes ? dish.likes.length : 0), 0);
      const averageRating = 4.8; // Mock rating
      
      // Top Dishes
      const topDishes = [...dishes]
        .sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0))
        .slice(0, 3)
        .map(dish => ({
          _id: dish._id,
          name: dish.title,
          image: dish.image,
          rating: { average: 4.5, count: dish.likes ? dish.likes.length : 0 }
        }));

      return res.json({
        role: 'business',
        overview: {
          totalRestaurants,
          totalDishes,
          totalLikes,
          averageRating
        },
        restaurants: restaurants.map(r => ({
          _id: r._id,
          name: r.name,
          address: r.address ? (typeof r.address === 'string' ? JSON.parse(r.address) : r.address) : {}, 
          logo: r.logo
        })),
        topDishes
      });
    } else {
      // Regular User Stats
      // Favorites
      const favoritesCount = (user.favoriteRecipes ? user.favoriteRecipes.length : 0) + (user.likedDishes ? user.likedDishes.length : 0);
      
      // Posts created
      // We need CommunityPost model here, let's require it at top or inline if circular dependency is an issue (it shouldn't be)
      const CommunityPost = require('../models/CommunityPost');
      const posts = await CommunityPost.find({ userId: userId });
      const postsCount = posts.length;
      
      // Likes received on posts
      const likesReceived = posts.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);

      return res.json({
        role: 'user',
        favoritesCount: {
          total: favoritesCount,
          recipes: user.favoriteRecipes ? user.favoriteRecipes.length : 0,
          dishes: user.likedDishes ? user.likedDishes.length : 0
        },
        likesCount: {
          total: likesReceived,
          posts: likesReceived
        },
        postsCount
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};
