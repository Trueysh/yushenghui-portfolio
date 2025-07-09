const Post = require('../models/Post');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const asyncHandler = require('../middleware/errorHandler').asyncHandler;

// @desc    获取所有文章
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  // 分页
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  // 查询参数
  let query = {};
  
  // 按类别筛选
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // 按标签筛选
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('comments.user', 'username');

  // 分页结果
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    pagination,
    data: posts
  });
});

// @desc    获取单篇文章
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('comments.user', 'username');

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  // 增加阅读量
  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    创建文章
// @route   POST /api/posts
// @access  Private (Admin)
exports.createPost = asyncHandler(async (req, res, next) => {
  // 添加作者信息
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    更新文章
// @route   PUT /api/posts/:id
// @access  Private (Admin)
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    删除文章
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    添加评论
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  const comment = {
    user: req.user.id,
    content: req.body.content
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json({
    success: true,
    data: post.comments[post.comments.length - 1]
  });
});

// @desc    删除评论
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  // 查找评论
  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.commentId}的评论`, 404)
    );
  }

  // 确保用户是评论作者或管理员
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('未授权删除此评论', 401)
    );
  }

  // 移除评论
  comment.deleteOne();
  await post.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    点赞文章
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  // 检查用户是否已点赞
  if (post.likes.includes(req.user.id)) {
    return next(
      new ErrorResponse('您已经点赞过此文章', 400)
    );
  }

  post.likes.push(req.user.id);
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    取消点赞
// @route   PUT /api/posts/:id/unlike
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的文章`, 404)
    );
  }

  // 检查用户是否已点赞
  if (!post.likes.includes(req.user.id)) {
    return next(
      new ErrorResponse('您尚未点赞此文章', 400)
    );
  }

  // 移除点赞
  post.likes = post.likes.filter(
    like => like.toString() !== req.user.id.toString()
  );
  
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
}); 