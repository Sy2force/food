const Joi = require('joi');

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    isBusiness: Joi.boolean()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRestaurant = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    kosherLevel: Joi.string().valid('Rabbanout', 'Mehadrin', 'Badatz', 'None'),
    logo: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    phone: Joi.string(),
    website: Joi.string().uri()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateDish = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0).required(),
    season: Joi.string().valid('Spring', 'Summer', 'Autumn', 'Winter', 'All Year'),
    region: Joi.string().valid('North', 'Center', 'South', 'Jerusalem', 'Coastal', 'All Regions'),
    image: Joi.string().uri(),
    restaurantId: Joi.string().required(),
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Drink', 'Side Dish'),
    isVegetarian: Joi.boolean(),
    isVegan: Joi.boolean()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRecipeBook = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(150).required(),
    subtitle: Joi.string().max(300),
    description: Joi.string().min(10).max(2000).required(),
    coverImage: Joi.string().uri(),
    theme: Joi.string().valid('Shabbat', 'Desert', 'Vegan', 'Beach', 'Traditional', 'Modern', 'Holidays', 'Street Food'),
    author: Joi.string()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRecipe = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(150).required(),
    image: Joi.string().uri(),
    description: Joi.string().min(10).max(1000).required(),
    ingredients: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.string().required(),
        unit: Joi.string()
      })
    ).required(),
    steps: Joi.array().items(
      Joi.object({
        stepNumber: Joi.number().required(),
        instruction: Joi.string().required(),
        image: Joi.string().uri()
      })
    ).required(),
    bookId: Joi.string().required(),
    prepTime: Joi.number().min(0),
    cookTime: Joi.number().min(0),
    servings: Joi.number().min(1),
    difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
    isVegetarian: Joi.boolean(),
    isVegan: Joi.boolean(),
    isKosher: Joi.boolean()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateCard = (req, res, next) => {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(100).required(),
    bizDescription: Joi.string().min(10).max(1000).required(),
    bizAddress: Joi.string().min(5).required(),
    bizPhone: Joi.string().pattern(/^[0-9+ -]{9,15}$/).required(),
    bizImage: Joi.string().uri()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRestaurant,
  validateDish,
  validateRecipeBook,
  validateRecipe,
  validateCard
};
