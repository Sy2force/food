const Joi = require('joi');

const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  role: Joi.string().valid('user', 'business', 'admin').default('user')
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  avatar: Joi.string().uri().optional()
});

const restaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().optional(),
    country: Joi.string().default('Israel')
  }).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  logo: Joi.string().uri().optional(),
  cacherout: Joi.string().valid('kasher', 'non-kasher', 'kasher-mehadrin').required(),
  cuisine: Joi.array().items(Joi.string()).min(1).required(),
  priceRange: Joi.string().valid('$', '$$', '$$$', '$$$$').default('$$'),
  openingHours: Joi.object().pattern(
    Joi.string(),
    Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean()
    })
  ).optional()
});

const dishSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri().optional(),
  category: Joi.string().valid('entrée', 'plat principal', 'dessert', 'boisson', 'accompagnement').required(),
  season: Joi.string().valid('printemps', 'été', 'automne', 'hiver', 'toute l\'année').default('toute l\'année'),
  region: Joi.string().valid('ashkénaze', 'séfarade', 'mizrahi', 'yéménite', 'éthiopien', 'moderne').required(),
  isVegetarian: Joi.boolean().default(false),
  isVegan: Joi.boolean().default(false),
  isGlutenFree: Joi.boolean().default(false),
  cacherout: Joi.string().valid('kasher', 'non-kasher', 'parve', 'lait', 'viande').required(),
  restaurant: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const recipeBookSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  theme: Joi.string().valid('fêtes juives', 'shabbat', 'cuisine quotidienne', 'pâtisserie', 'végétarien', 'traditionnel', 'moderne').required(),
  coverImage: Joi.string().uri().optional(),
  author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const recipeSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      quantity: Joi.string().required(),
      unit: Joi.string().optional()
    })
  ).min(1).required(),
  steps: Joi.array().items(Joi.string().min(5)).min(1).required(),
  prepTime: Joi.number().min(0).required(),
  cookTime: Joi.number().min(0).required(),
  servings: Joi.number().min(1).required(),
  difficulty: Joi.string().valid('facile', 'moyen', 'difficile').required(),
  image: Joi.string().uri().optional(),
  category: Joi.string().valid('entrée', 'plat principal', 'dessert', 'boisson', 'accompagnement').required(),
  region: Joi.string().valid('ashkénaze', 'séfarade', 'mizrahi', 'yéménite', 'éthiopien', 'moderne').required(),
  cacherout: Joi.string().valid('kasher', 'non-kasher', 'parve', 'lait', 'viande').required(),
  recipeBook: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const postSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
  photo: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
  author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
  restaurantSchema,
  dishSchema,
  recipeBookSchema,
  recipeSchema,
  postSchema
};
