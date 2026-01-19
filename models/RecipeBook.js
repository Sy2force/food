const mongoose = require('mongoose');

const recipeBookSchema = new mongoose.Schema({
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
  theme: {
    type: String,
    enum: ['fêtes juives', 'shabbat', 'cuisine quotidienne', 'pâtisserie', 'végétarien', 'traditionnel', 'moderne'],
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

recipeBookSchema.index({ title: 'text', description: 'text' });
recipeBookSchema.index({ author: 1 });
recipeBookSchema.index({ theme: 1 });

module.exports = mongoose.model('RecipeBook', recipeBookSchema);
