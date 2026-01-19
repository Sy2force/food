const mongoose = require('mongoose');

const recipeBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe book title is required'],
    trim: true,
    minlength: 2,
    maxlength: 150
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10,
    maxlength: 2000
  },
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/book-placeholder.jpg'
  },
  theme: {
    type: String,
    enum: ['Shabbat', 'Desert', 'Vegan', 'Beach', 'Traditional', 'Modern', 'Holidays', 'Street Food'],
    default: 'Traditional'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

recipeBookSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

module.exports = mongoose.model('RecipeBook', recipeBookSchema);
