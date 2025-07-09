const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  approveComment,
  getCategories,
  getTags,
  getPostStats
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// 公开路由
router.get('/', getPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:id', getPost);
router.put('/:id/like', likePost);
router.post('/:id/comments', addComment);

// 需要登录的路由
router.use(protect);

// 仅管理员可访问的路由
router.post('/', authorize('admin'), upload.single('coverImage'), createPost);
router.put('/:id', authorize('admin'), upload.single('coverImage'), updatePost);
router.delete('/:id', authorize('admin'), deletePost);
router.put('/:id/comments/:commentId', authorize('admin'), approveComment);
router.get('/stats/admin', authorize('admin'), getPostStats);

module.exports = router; 