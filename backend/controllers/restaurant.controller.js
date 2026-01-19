const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      ownerId: req.userId
    };
    
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    
    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error: error.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const { city, kosherLevel, page = 1, limit = 12 } = req.query;
    
    const filter = { isActive: true };
    if (city) filter.city = city;
    if (kosherLevel) filter.kosherLevel = kosherLevel;
    
    const skip = (page - 1) * limit;
    
    const restaurants = await Restaurant.find(filter)
      .populate('ownerId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Restaurant.countDocuments(filter);
    
    res.json({
      restaurants,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('ownerId', 'name email avatar');
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    const dishes = await Dish.find({ restaurantId: restaurant._id, isActive: true });
    
    res.json({
      restaurant,
      dishes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    await Dish.updateMany(
      { restaurantId: restaurant._id },
      { isActive: false }
    );
    
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.userId });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};
