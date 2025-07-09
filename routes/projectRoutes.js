const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// 公开路由
router.get('/', getProjects);
router.get('/:id', getProject);

// 受保护的路由（需要登录和管理员权限）
router.post('/', protect, authorize('admin'), upload.single('image'), createProject);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router; 