const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const User = require('../models/User');

exports.getBusinessStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const restaurants = await Restaurant.find({ owner: userId });
    const restaurantIds = restaurants.map(r => r._id);

    const dishes = await Dish.find({ restaurant: { $in: restaurantIds } });

    const totalLikes = dishes.reduce((sum, dish) => sum + (dish.rating?.count || 0), 0);
    const totalDishes = dishes.length;
    const totalRestaurants = restaurants.length;

    const topDishes = dishes
      .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
      .slice(0, 5);

    const dishStats = dishes.map(dish => ({
      _id: dish._id,
      name: dish.name,
      image: dish.image,
      likes: dish.rating?.count || 0,
      rating: dish.rating?.average || 0,
      restaurant: restaurants.find(r => r._id.toString() === dish.restaurant.toString())?.name
    }));

    res.json({
      overview: {
        totalRestaurants,
        totalDishes,
        totalLikes,
        averageRating: totalDishes > 0 
          ? (dishes.reduce((sum, d) => sum + (d.rating?.average || 0), 0) / totalDishes).toFixed(1)
          : 0
      },
      restaurants,
      dishes: dishStats,
      topDishes
    });
  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user._id;

    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: userId });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }

    const dishes = await Dish.find({ restaurant: restaurantId });

    const stats = {
      restaurant,
      totalDishes: dishes.length,
      totalLikes: dishes.reduce((sum, dish) => sum + (dish.rating?.count || 0), 0),
      averageRating: dishes.length > 0
        ? (dishes.reduce((sum, d) => sum + (d.rating?.average || 0), 0) / dishes.length).toFixed(1)
        : 0,
      dishesByCategory: {},
      dishesByRegion: {},
      topDishes: dishes
        .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
        .slice(0, 10)
    };

    dishes.forEach(dish => {
      stats.dishesByCategory[dish.category] = (stats.dishesByCategory[dish.category] || 0) + 1;
      stats.dishesByRegion[dish.region] = (stats.dishesByRegion[dish.region] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Erreur stats restaurant:', error);
    res.status(500).json({ error: error.message });
  }
};
