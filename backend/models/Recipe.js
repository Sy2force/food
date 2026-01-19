const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    minlength: 2,
    maxlength: 150
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/recipe-placeholder.jpg'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
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
    unit: {
      type: String
    }
  }],
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  }],
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipeBook',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  prepTime: {
    type: Number,
    min: 0
  },
  cookTime: {
    type: Number,
    min: 0
  },
  servings: {
    type: Number,
    min: 1,
    default: 4
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isKosher: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

recipeSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

recipeSchema.virtual('totalTime').get(function() {
  return (this.prepTime || 0) + (this.cookTime || 0);
});

module.exports = mongoose.model('Recipe', recipeSchema);
