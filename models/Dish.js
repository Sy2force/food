const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
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
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
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
  season: {
    type: String,
    enum: ['printemps', 'été', 'automne', 'hiver', 'toute l\'année'],
    default: 'toute l\'année'
  },
  region: {
    type: String,
    enum: ['ashkénaze', 'séfarade', 'mizrahi', 'yéménite', 'éthiopien', 'moderne'],
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  cacherout: {
    type: String,
    enum: ['kasher', 'non-kasher', 'parve', 'lait', 'viande'],
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
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
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

dishSchema.index({ name: 'text', description: 'text' });
dishSchema.index({ category: 1, region: 1 });
dishSchema.index({ restaurant: 1 });

module.exports = mongoose.model('Dish', dishSchema);
