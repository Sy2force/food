const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: 2,
    maxlength: 150
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10,
    maxlength: 1000
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  imagePublicId: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  dishType: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Drink', 'Side Dish', 'Snack', 'Other'],
    default: 'Other'
  },
  isKosher: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

communityPostSchema.index({ userId: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });

communityPostSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

communityPostSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
