const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: [true, 'Business name is required'],
    minlength: 2,
    maxlength: 100
  },
  bizDescription: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10,
    maxlength: 1000
  },
  bizAddress: {
    type: String,
    required: [true, 'Address is required'],
    minlength: 5
  },
  bizPhone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^[0-9+ -]{9,15}$/, 'Please provide a valid phone number']
  },
  bizImage: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  bizNumber: {
    type: Number,
    required: true,
    unique: true,
    default: () => Math.floor(1000000 + Math.random() * 9000000) // Random 7 digit number
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
