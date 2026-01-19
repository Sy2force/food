const Card = require('../models/Card');
const User = require('../models/User');

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error: error.message });
  }
};

exports.getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.userId });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching my cards', error: error.message });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching card', error: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    // bizNumber is generated automatically by default in schema, 
    // but if we wanted to check uniqueness explicitly we could.
    // The schema has unique: true, so mongo will throw if collision (rare with 7 digits random).
    
    // Check if bizNumber collision handling is needed? 
    // For simple implementation, let mongoose handle uniqueness. 
    // If collision, we might want to retry, but 9M combinations is plenty for this scope.

    // Validate bizImage if not provided, use default
    // Using default from schema.

    const card = new Card({
      ...req.body,
      user_id: req.userId
    });

    await card.save();
    res.status(201).json(card);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Card with this business number already exists' });
    }
    res.status(400).json({ message: 'Error creating card', error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    // Ownership check is done in middleware isOwnerOrAdmin, but strict requirement says "Creator".
    // Middleware puts resource in req.resource
    
    // We can update directly.
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    res.status(400).json({ message: 'Error updating card', error: error.message });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check if already liked
    const index = card.likes.indexOf(req.userId);
    if (index === -1) {
      // Like
      card.likes.push(req.userId);
    } else {
      // Unlike
      card.likes.splice(index, 1);
    }

    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
};
