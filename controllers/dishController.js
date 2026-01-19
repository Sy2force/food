const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const { uploadToCloudinary } = require('../utils/uploadImage');

exports.createDish = async (req, res) => {
  try {
    const dishData = req.validatedBody;

    const restaurant = await Restaurant.findById(dishData.restaurant);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'dishes');
      dishData.image = result.secure_url;
    }

    const dish = new Dish(dishData);
    await dish.save();

    restaurant.dishes.push(dish._id);
    await restaurant.save();

    res.status(201).json({
      message: 'Plat créé avec succès',
      dish
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, region, season, cacherout, search, restaurant } = req.query;
    const query = { isAvailable: true };

    if (category) query.category = category;
    if (region) query.region = region;
    if (season) query.season = season;
    if (cacherout) query.cacherout = cacherout;
    if (restaurant) query.restaurant = restaurant;
    if (search) query.$text = { $search: search };

    const dishes = await Dish.find(query)
      .populate('restaurant', 'name logo cacherout')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Dish.countDocuments(query);

    res.json({
      dishes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('restaurant');

    if (!dish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('restaurant');

    if (!dish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    if (dish.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updates = req.validatedBody;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'dishes');
      updates.image = result.secure_url;
    }

    Object.assign(dish, updates);
    await dish.save();

    res.json({
      message: 'Plat mis à jour',
      dish
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('restaurant');

    if (!dish) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }

    if (dish.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await Restaurant.findByIdAndUpdate(
      dish.restaurant._id,
      { $pull: { dishes: dish._id } }
    );

    await Dish.findByIdAndDelete(req.params.id);

    res.json({ message: 'Plat supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
