const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { postSchema } = require('../utils/validators');
const { upload } = require('../utils/uploadImage');

router.post('/', auth, upload.single('photo'), validate(postSchema), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/my-posts', auth, postController.getMyPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', auth, upload.single('photo'), validate(postSchema), postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.likePost);
router.post('/:id/comments', auth, postController.addComment);
router.delete('/:id/comments/:commentId', auth, postController.deleteComment);

module.exports = router;
