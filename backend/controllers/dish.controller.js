const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

exports.createDish = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    if (restaurant.ownerId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to add dishes to this restaurant' });
    }
    
    const dish = new Dish(req.body);
    await dish.save();
    
    res.status(201).json({
      message: 'Dish created successfully',
      dish
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating dish', error: error.message });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const { season, region, restaurantId, category, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    
    const filter = { isActive: true };
    if (season) filter.season = season;
    if (region) filter.region = region;
    if (restaurantId) filter.restaurantId = restaurantId;
    if (category) filter.category = category;
    
    const skip = (page - 1) * limit;
    
    const dishes = await Dish.find(filter)
      .populate('restaurantId', 'name city kosherLevel logo')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);
    
    const total = await Dish.countDocuments(filter);
    
    res.json({
      dishes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('restaurantId', 'name city address kosherLevel logo phone website')
      .populate('likes', 'name avatar');
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json({ dish });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dish', error: error.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    const restaurant = await Restaurant.findById(dish.restaurantId);
    if (restaurant.ownerId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this dish' });
    }
    
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Dish updated successfully',
      dish: updatedDish
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating dish', error: error.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting dish', error: error.message });
  }
};

exports.likeDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    const likeIndex = dish.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      dish.likes.splice(likeIndex, 1);
      await User.findByIdAndUpdate(req.userId, {
        $pull: { likedDishes: dish._id }
      });
    } else {
      dish.likes.push(req.userId);
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { likedDishes: dish._id }
      });
    }
    
    await dish.save();
    
    res.json({
      message: likeIndex > -1 ? 'Dish unliked' : 'Dish liked',
      likes: dish.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking dish', error: error.message });
  }
};
