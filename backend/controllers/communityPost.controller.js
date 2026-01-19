const CommunityPost = require('../models/CommunityPost');
const cloudinary = require('../config/cloudinary');

exports.createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      userId: req.userId
    };
    
    const post = new CommunityPost(postData);
    await post.save();
    
    await post.populate('userId', 'name avatar');
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt', tag, dishType } = req.query;
    
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    if (dishType) filter.dishType = dishType;
    
    const skip = (page - 1) * limit;
    
    const posts = await CommunityPost.find(filter)
      .populate('userId', 'name avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);
    
    const total = await CommunityPost.countDocuments(filter);
    
    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name avatar email')
      .populate('likes', 'name avatar')
      .populate('comments.userId', 'name avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.views += 1;
    await post.save();
    
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const updatedPost = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name avatar');
    
    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    
    await CommunityPost.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const likeIndex = post.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.userId);
    }
    
    await post.save();
    
    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      userId: req.userId,
      text: text.trim()
    });
    
    await post.save();
    await post.populate('comments.userId', 'name avatar');
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.userId.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    comment.remove();
    await post.save();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.aggregate([
      { $match: { isPublished: true } },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: [{ $size: '$likes' }, 2] },
              { $multiply: [{ $size: '$comments' }, 1.5] },
              { $divide: ['$views', 10] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 12 }
    ]);
    
    await CommunityPost.populate(posts, { path: 'userId', select: 'name avatar' });
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending posts', error: error.message });
  }
};
