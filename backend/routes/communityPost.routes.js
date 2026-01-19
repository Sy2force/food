const express = require('express');
const router = express.Router();
const communityPostController = require('../controllers/communityPost.controller');
const { auth } = require('../middleware/auth');

router.get('/', communityPostController.getAllPosts);
router.get('/trending', communityPostController.getTrendingPosts);
router.get('/my-posts', auth, communityPostController.getMyPosts);
router.get('/:id', communityPostController.getPostById);
router.post('/', auth, communityPostController.createPost);
router.put('/:id', auth, communityPostController.updatePost);
router.delete('/:id', auth, communityPostController.deletePost);
router.post('/:id/like', auth, communityPostController.likePost);
router.post('/:id/comments', auth, communityPostController.addComment);
router.delete('/:id/comments/:commentId', auth, communityPostController.deleteComment);

module.exports = router;
