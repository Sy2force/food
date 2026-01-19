const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const Recipe = require('../models/Recipe');
const CommunityPost = require('../models/CommunityPost');

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      newUsers,
      totalRestaurants,
      pendingRestaurants,
      totalDishes,
      totalRecipes,
      pendingRecipes // Assuming recipes might need approval later, or just counting recent ones
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }), // Last 30 days
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ status: 'pending' }),
      Dish.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }) // New recipes last 7 days as proxy for "action required" if no status
    ]);

    res.json({
      users: {
        total: totalUsers,
        new: newUsers,
        active: totalUsers // Placeholder
      },
      restaurants: {
        total: totalRestaurants,
        pending: pendingRestaurants,
        reported: 0
      },
      dishes: {
        total: totalDishes,
        new: 0
      },
      recipes: {
        total: totalRecipes,
        pending: 0 // No approval flow for recipes yet
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'pending' })
      .populate('ownerId', 'name email')
      .sort({ createdAt: 1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending restaurants', error: error.message });
  }
};

exports.approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isActive: true },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant approved', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error approving restaurant', error: error.message });
  }
};

exports.rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isActive: false },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant rejected', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting restaurant', error: error.message });
  }
};

exports.getModerationQueue = async (req, res) => {
  try {
    // For now, just return pending restaurants and maybe some flagged posts (mock logic for flags)
    const pendingRestaurants = await Restaurant.find({ status: 'pending' }).populate('ownerId', 'name');
    
    // Example: Fetch reported posts if we implemented reporting
    // const reportedPosts = await CommunityPost.find({ reported: true });

    res.json({
      restaurants: pendingRestaurants,
      posts: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching moderation queue', error: error.message });
  }
};

exports.resolveReport = async (req, res) => {
  // Placeholder for report resolution
  res.json({ message: 'Report resolved' });
};
