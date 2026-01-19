const mongoose = require('mongoose');
const User = require('../models/User');
const Card = require('../models/Card');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    isAdmin: true,
    isBusiness: false
  },
  {
    name: 'Business User',
    email: 'business@test.com',
    password: 'password123',
    isAdmin: false,
    isBusiness: true
  },
  {
    name: 'Standard User',
    email: 'user@test.com',
    password: 'password123',
    isAdmin: false,
    isBusiness: false
  }
];

const cards = [
  {
    bizName: 'Tel Aviv Falafel',
    bizDescription: 'Best Falafel in town, authentic taste.',
    bizAddress: 'Dizengoff 100, Tel Aviv',
    bizPhone: '054-1234567',
    bizImage: 'https://cdn.pixabay.com/photo/2017/06/16/11/38/falafel-2408665_960_720.jpg'
  },
  {
    bizName: 'Jerusalem Hummus',
    bizDescription: 'Creamy hummus with fresh pita.',
    bizAddress: 'Jaffa Road 20, Jerusalem',
    bizPhone: '052-7654321',
    bizImage: 'https://cdn.pixabay.com/photo/2016/11/22/18/52/hummus-1850116_960_720.jpg'
  },
  {
    bizName: 'Eilat Seafood',
    bizDescription: 'Fresh catch from the Red Sea.',
    bizAddress: 'Promenade 5, Eilat',
    bizPhone: '050-9876543',
    bizImage: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_960_720.jpg'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Card.deleteMany({});
    console.log('🗑️ Cleared Users and Cards');

    // Create Users
    const createdUsers = [];
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }
    console.log('👥 Created 3 Users (Admin, Business, Standard)');

    // Create Cards (Assigned to Business User)
    const businessUser = createdUsers.find(u => u.isBusiness);
    if (businessUser) {
      for (const card of cards) {
        await Card.create({
          ...card,
          user_id: businessUser._id
        });
      }
      console.log('🃏 Created 3 Cards assigned to Business User');
    }

    mongoose.disconnect();
    console.log('👋 Disconnected');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
