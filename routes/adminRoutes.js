const express = require('express');
const {
  dashboard,
  projects,
  editProject,
  newProject,
  contacts,
  contactDetails,
  posts,
  editPost,
  newPost,
  comments,
  profile,
  showLogin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 登录页面 - 公开路由
router.get('/login', showLogin);

// 以下路由需要登录和管理员权限
router.use(protect);
router.use(authorize('admin'));

// 仪表板
router.get('/', dashboard);

// 项目管理
router.get('/projects', projects);
router.get('/projects/new', newProject);
router.get('/projects/:id/edit', editProject);

// 联系信息管理
router.get('/contacts', contacts);
router.get('/contacts/:id', contactDetails);

// 博客管理
router.get('/posts', posts);
router.get('/posts/new', newPost);
router.get('/posts/:id/edit', editPost);

// 评论管理
router.get('/comments', comments);

// 用户配置
router.get('/profile', profile);

module.exports = router; 