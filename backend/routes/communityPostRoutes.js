const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for media uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/community/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, video, and document files are allowed'));
    }
  }
});

// ===== PUBLIC ROUTES (for frontend display) =====

// Get all approved posts with pagination
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const skip = (page - 1) * limit;
    
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'mostLiked':
        sortOption = { 'likes.length': -1 };
        break;
      case 'mostCommented':
        sortOption = { 'comments.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await CommunityPost.find({ 
      status: 'approved',
      isFlagged: false 
    })
    .populate('author', 'username profilePicture')
    .populate('comments.author', 'username profilePicture')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

    const total = await CommunityPost.countDocuments({ 
      status: 'approved',
      isFlagged: false 
    });

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get a single post by ID
router.get('/public/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture')
      .populate('likes', 'username profilePicture');

    if (!post || post.status !== 'approved' || post.isFlagged) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// ===== AUTHENTICATED USER ROUTES =====

// Create a new post
router.post('/', verifyToken, upload.array('media', 5), async (req, res) => {
  try {
    const { content, tags } = req.body;
    const author = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // Process uploaded media files
    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const mediaType = file.mimetype.startsWith('image/') ? 'image' :
                         file.mimetype.startsWith('video/') ? 'video' : 'document';
        media.push({
          url: `/uploads/community/${file.filename}`,
          mediaType: mediaType
        });
      });
    }

    // Extract hashtags from content
    const extractedTags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const finalTags = [...new Set([...extractedTags, ...(tags ? tags.split(',').map(t => t.trim()) : [])])];

    const post = new CommunityPost({
      author,
      content: content.trim(),
      media,
      tags: finalTags,
      status: 'approved' // Auto-approve for now, can be changed to 'pending' for moderation
    });

    await post.save();

    // Populate author info for response
    await post.populate('author', 'username profilePicture');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Update a post (only by author)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { content, tags } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    if (content && content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    // Extract hashtags from content
    const extractedTags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const finalTags = [...new Set([...extractedTags, ...(tags ? tags.split(',').map(t => t.trim()) : [])])];

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      postId,
      {
        content: content?.trim(),
        tags: finalTags,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('author', 'username profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// Delete a post (only by author)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await CommunityPost.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// ===== LIKE/UNLIKE ROUTES =====

// Like a post
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot like unapproved posts' });
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    // Populate author info for response
    await post.populate('author', 'username profilePicture');

    res.json({
      message: 'Post liked successfully',
      likeCount: post.likes.length,
      isLiked: true
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

// Unlike a post
router.delete('/:id/like', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      return res.status(400).json({ message: 'Post not liked' });
    }

    post.likes.splice(likeIndex, 1);
    await post.save();

    res.json({
      message: 'Post unliked successfully',
      likeCount: post.likes.length,
      isLiked: false
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Failed to unlike post' });
  }
});

// ===== REACTIONS ROUTES =====

// React to a post (set/replace reaction type for current user)
router.post('/:id/react', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;
    const ALLOWED = ['👍','❤️','😂','👏','🙌'];
    if (!ALLOWED.includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // remove existing reaction by this user
    post.reactions = (post.reactions || []).filter(r => r.userId.toString() !== userId);
    // add new reaction
    post.reactions.push({ userId, type, createdAt: new Date() });
    await post.save();
    const counts = ALLOWED.reduce((acc, t) => {
      acc[t] = post.reactions.filter(r => r.type === t).length;
      return acc;
    }, {});
    res.json({ message: 'Reaction saved', counts, myReaction: type });
  } catch (e) {
    console.error('Error reacting to post:', e);
    res.status(500).json({ message: 'Failed to save reaction' });
  }
});

// Remove current user's reaction
router.delete('/:id/react', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const ALLOWED = ['👍','❤️','😂','👏','🙌'];
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const before = (post.reactions || []).length;
    post.reactions = (post.reactions || []).filter(r => r.userId.toString() !== userId);
    const removed = before !== post.reactions.length;
    await post.save();
    const counts = ALLOWED.reduce((acc, t) => {
      acc[t] = post.reactions.filter(r => r.type === t).length;
      return acc;
    }, {});
    res.json({ message: removed ? 'Reaction removed' : 'No reaction to remove', counts, myReaction: null });
  } catch (e) {
    console.error('Error removing reaction:', e);
    res.status(500).json({ message: 'Failed to remove reaction' });
  }
});

// ===== COMMENT ROUTES =====

// Add a comment to a post
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const author = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot comment on unapproved posts' });
    }

    const comment = {
      author,
      content: content.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Populate comment author info
    await post.populate('comments.author', 'username profilePicture');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
      commentCount: post.comments.length
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Add a reply to a comment
router.post('/:id/comments/:commentId/replies', verifyToken, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const author = req.user.id;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Reply content is required' });
    }
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const reply = { author, content: content.trim(), createdAt: new Date() };
    comment.replies = comment.replies || [];
    comment.replies.push(reply);
    await post.save();
    // populate reply author
    await post.populate('comments.author', 'username profilePicture');
    await post.populate('comments.replies.author', 'username profilePicture');
    const savedComment = post.comments.id(commentId);
    const newReply = savedComment.replies[savedComment.replies.length - 1];
    res.status(201).json({ message: 'Reply added', reply: newReply });
  } catch (e) {
    console.error('Error adding reply:', e);
    res.status(500).json({ message: 'Failed to add reply' });
  }
});

// Update a comment
router.patch('/:id/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const { id: postId, commentId } = req.params;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }

    comment.content = content.trim();
    comment.updatedAt = new Date();
    await post.save();

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    comment.remove();
    await post.save();

    res.json({
      message: 'Comment deleted successfully',
      commentCount: post.comments.length
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// ===== USER-SPECIFIC ROUTES =====

// Get posts by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find({
      author: userId,
      status: 'approved',
      isFlagged: false
    })
    .populate('author', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await CommunityPost.countDocuments({
      author: userId,
      status: 'approved',
      isFlagged: false
    });

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
});

// Get posts by authenticated user
router.get('/my-posts', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const posts = await CommunityPost.find({
      author: userId
    })
    .populate('author', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await CommunityPost.countDocuments({
      author: userId
    });

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error fetching my posts:', error);
    res.status(500).json({ message: 'Failed to fetch my posts' });
  }
});

module.exports = router;
