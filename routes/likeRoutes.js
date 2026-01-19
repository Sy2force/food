const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

router.post('/:type/:id', auth, likeController.toggleLike);
router.get('/user', auth, likeController.getUserLikes);
router.get('/check/:type/:id', auth, likeController.checkIfLiked);

module.exports = router;
