const Post = require('../models/Post');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadImage');

exports.createPost = async (req, res) => {
  try {
    const postData = {
      ...req.validatedBody,
      author: req.user._id
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'posts');
      postData.photo = result.secure_url;
      postData.photoPublicId = result.public_id;
    }

    const post = new Post(postData);
    await post.save();

    res.status(201).json({
      message: 'Post créé avec succès',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, tags, author } = req.query;
    const query = { isPublished: true };

    if (tags) query.tags = { $in: tags.split(',') };
    if (author) query.author = author;

    const posts = await Post.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('comments.user', 'firstName lastName avatar')
      .populate('likes', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('comments.user', 'firstName lastName avatar')
      .populate('likes', 'firstName lastName');

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updates = req.validatedBody;

    if (req.file) {
      if (post.photoPublicId) {
        await deleteFromCloudinary(post.photoPublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'posts');
      updates.photo = result.secure_url;
      updates.photoPublicId = result.public_id;
    }

    Object.assign(post, updates);
    await post.save();

    res.json({
      message: 'Post mis à jour',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    if (post.photoPublicId) {
      await deleteFromCloudinary(post.photoPublicId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? 'Like retiré' : 'Like ajouté',
      likes: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Le commentaire ne peut pas être vide' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    post.comments.push({
      user: req.user._id,
      content: content.trim()
    });

    await post.save();
    await post.populate('comments.user', 'firstName lastName avatar');

    res.json({
      message: 'Commentaire ajouté',
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    comment.remove();
    await post.save();

    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('likes', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
