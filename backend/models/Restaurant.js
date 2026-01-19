const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10,
    maxlength: 2000
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  kosherLevel: {
    type: String,
    enum: ['Rabbanout', 'Mehadrin', 'Badatz', 'None'],
    default: 'None'
  },
  logo: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/restaurant-placeholder.jpg'
  },
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/cover-placeholder.jpg'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

restaurantSchema.index({ city: 1, kosherLevel: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
