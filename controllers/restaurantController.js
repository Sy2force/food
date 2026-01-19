const Restaurant = require('../models/Restaurant');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadImage');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurantData = {
      ...req.validatedBody,
      owner: req.user._id
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'restaurants');
      restaurantData.logo = result.secure_url;
    }

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant créé avec succès',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, cacherout, cuisine, search } = req.query;
    const query = { isActive: true };

    if (city) query['address.city'] = city;
    if (cacherout) query.cacherout = cacherout;
    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (search) query.$text = { $search: search };

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'firstName lastName email')
      .populate('dishes');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updates = req.validatedBody;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'restaurants');
      updates.logo = result.secure_url;
    }

    Object.assign(restaurant, updates);
    await restaurant.save();

    res.json({
      message: 'Restaurant mis à jour',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: 'Restaurant supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id })
      .populate('dishes')
      .sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
