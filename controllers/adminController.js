const User = require('../models/User');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const Post = require('../models/Post');

// @desc    显示管理员仪表板
// @route   GET /admin
// @access  私有/管理员
exports.dashboard = async (req, res, next) => {
  try {
    // 获取统计数据
    const stats = {};
    
    // 项目统计
    stats.totalProjects = await Project.countDocuments();
    stats.featuredProjects = await Project.countDocuments({ featured: true });
    
    // 联系统计
    stats.totalContacts = await Contact.countDocuments();
    stats.unreadContacts = await Contact.countDocuments({ status: '未读' });
    
    // 博客统计
    stats.totalPosts = await Post.countDocuments();
    stats.publishedPosts = await Post.countDocuments({ status: '已发布' });
    stats.draftPosts = await Post.countDocuments({ status: '草稿' });
    
    // 评论统计
    const posts = await Post.find();
    stats.totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    stats.pendingComments = posts.reduce((sum, post) => {
      const pendingComments = post.comments.filter(comment => !comment.isApproved);
      return sum + pendingComments.length;
    }, 0);
    
    // 最近的联系信息
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // 最近的博客文章
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // 渲染仪表板页面
    res.render('admin/dashboard', {
      title: '管理员仪表板',
      stats,
      recentContacts,
      recentPosts,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示项目管理页面
// @route   GET /admin/projects
// @access  私有/管理员
exports.projects = async (req, res, next) => {
  try {
    // 获取所有项目
    const projects = await Project.find().sort({ order: 1 });
    
    // 渲染项目管理页面
    res.render('admin/projects', {
      title: '项目管理',
      projects,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示项目编辑页面
// @route   GET /admin/projects/:id/edit
// @access  私有/管理员
exports.editProject = async (req, res, next) => {
  try {
    // 获取项目
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).render('admin/error', {
        title: '错误',
        message: '找不到此项目',
        user: req.user
      });
    }
    
    // 渲染项目编辑页面
    res.render('admin/edit-project', {
      title: '编辑项目',
      project,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示新项目页面
// @route   GET /admin/projects/new
// @access  私有/管理员
exports.newProject = (req, res) => {
  res.render('admin/edit-project', {
    title: '新项目',
    project: null,
    user: req.user
  });
};

// @desc    显示联系信息管理页面
// @route   GET /admin/contacts
// @access  私有/管理员
exports.contacts = async (req, res, next) => {
  try {
    // 获取所有联系信息
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    // 渲染联系信息管理页面
    res.render('admin/contacts', {
      title: '联系信息管理',
      contacts,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示联系信息详情页面
// @route   GET /admin/contacts/:id
// @access  私有/管理员
exports.contactDetails = async (req, res, next) => {
  try {
    // 获取联系信息
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).render('admin/error', {
        title: '错误',
        message: '找不到此联系信息',
        user: req.user
      });
    }
    
    // 如果状态是未读，更新为已读
    if (contact.status === '未读') {
      contact.status = '已读';
      await contact.save();
    }
    
    // 渲染联系信息详情页面
    res.render('admin/contact-details', {
      title: '联系信息详情',
      contact,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示博客管理页面
// @route   GET /admin/posts
// @access  私有/管理员
exports.posts = async (req, res, next) => {
  try {
    // 获取所有博客文章
    const posts = await Post.find()
      .populate({
        path: 'author',
        select: 'username email'
      })
      .sort({ createdAt: -1 });
    
    // 渲染博客管理页面
    res.render('admin/posts', {
      title: '博客管理',
      posts,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示博客编辑页面
// @route   GET /admin/posts/:id/edit
// @access  私有/管理员
exports.editPost = async (req, res, next) => {
  try {
    // 获取博客文章
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).render('admin/error', {
        title: '错误',
        message: '找不到此博客文章',
        user: req.user
      });
    }
    
    // 渲染博客编辑页面
    res.render('admin/edit-post', {
      title: '编辑博客',
      post,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示新博客页面
// @route   GET /admin/posts/new
// @access  私有/管理员
exports.newPost = (req, res) => {
  res.render('admin/edit-post', {
    title: '新博客',
    post: null,
    user: req.user
  });
};

// @desc    显示评论管理页面
// @route   GET /admin/comments
// @access  私有/管理员
exports.comments = async (req, res, next) => {
  try {
    // 获取所有包含评论的文章
    const posts = await Post.find({ 'comments.0': { $exists: true } })
      .populate({
        path: 'author',
        select: 'username email'
      });
    
    // 提取所有评论并添加文章信息
    let allComments = [];
    posts.forEach(post => {
      post.comments.forEach(comment => {
        allComments.push({
          ...comment.toObject(),
          postId: post._id,
          postTitle: post.title,
          postSlug: post.slug
        });
      });
    });
    
    // 按创建日期排序
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 渲染评论管理页面
    res.render('admin/comments', {
      title: '评论管理',
      comments: allComments,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示用户配置页面
// @route   GET /admin/profile
// @access  私有/管理员
exports.profile = async (req, res, next) => {
  try {
    // 获取当前用户详细信息
    const user = await User.findById(req.user.id);
    
    // 渲染用户配置页面
    res.render('admin/profile', {
      title: '个人资料',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    显示登录页面
// @route   GET /admin/login
// @access  公开
exports.showLogin = (req, res) => {
  // 如果用户已登录，重定向到仪表板
  if (req.user) {
    return res.redirect('/admin');
  }
  
  // 渲染登录页面
  res.render('admin/login', {
    title: '管理员登录',
    user: null
  });
}; 