const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');
const { auth, isBusiness, isOwnerOrAdmin } = require('../middleware/auth');
const { validateCard } = require('../middleware/validation');
const Card = require('../models/Card');

// Middleware helper for ownership specific to Cards for update/delete
// Since the requirement says "Creator" for PUT and "Creator or admin" for DELETE.
// isOwnerOrAdmin middleware handles "Owner or Admin".
// For PUT, if we strictly want ONLY Creator, we might need a separate check or use isOwnerOrAdmin and refine.
// Requirement: PUT /cards/:id -> Créateur
// Requirement: DELETE /cards/:id -> Créateur ou admin

const isCreator = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    if (card.user_id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied. You are not the creator of this card.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /cards - Public - Voir toutes les cartes
router.get('/', cardController.getAllCards);

// GET /cards/my-cards - Utilisateur connecté - Voir mes cartes
router.get('/my-cards', auth, cardController.getMyCards);

// GET /cards/:id - Public - Voir une carte
router.get('/:id', cardController.getCardById);

// POST /cards - Business uniquement - Créer une carte
router.post('/', auth, isBusiness, validateCard, cardController.createCard);

// PUT /cards/:id - Créateur - Modifier une carte
router.put('/:id', auth, isCreator, validateCard, cardController.updateCard);

// PATCH /cards/:id - Utilisateur connecté - Liker une carte
router.patch('/:id', auth, cardController.likeCard);

// DELETE /cards/:id - Créateur ou admin - Supprimer une carte
router.delete('/:id', auth, isOwnerOrAdmin(Card), cardController.deleteCard);

module.exports = router;
