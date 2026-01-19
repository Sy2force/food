const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    unit: String
  }],
  steps: [{
    type: String,
    required: true,
    minlength: 5
  }],
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  cookTime: {
    type: Number,
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['entrée', 'plat principal', 'dessert', 'boisson', 'accompagnement'],
    required: true
  },
  region: {
    type: String,
    enum: ['ashkénaze', 'séfarade', 'mizrahi', 'yéménite', 'éthiopien', 'moderne'],
    required: true
  },
  cacherout: {
    type: String,
    enum: ['kasher', 'non-kasher', 'parve', 'lait', 'viande'],
    required: true
  },
  recipeBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipeBook'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ author: 1 });
recipeSchema.index({ category: 1, region: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
