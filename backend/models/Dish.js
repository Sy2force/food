const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Dish title is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Autumn', 'Winter', 'All Year'],
    default: 'All Year'
  },
  region: {
    type: String,
    enum: ['North', 'Center', 'South', 'Jerusalem', 'Coastal', 'All Regions'],
    default: 'All Regions'
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/dish-placeholder.jpg'
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Drink', 'Side Dish'],
    default: 'Main Course'
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

dishSchema.index({ season: 1, region: 1, restaurantId: 1 });

dishSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

module.exports = mongoose.model('Dish', dishSchema);
