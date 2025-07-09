const Project = require('../models/Project');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const asyncHandler = require('../middleware/errorHandler').asyncHandler;

// @desc    获取所有项目
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  // 分页
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Project.countDocuments();

  // 查询参数
  let query = {};
  
  // 按类别筛选
  if (req.query.category) {
    query.category = req.query.category;
  }

  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

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
    count: projects.length,
    pagination,
    data: projects
  });
});

// @desc    获取单个项目
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    创建项目
// @route   POST /api/projects
// @access  Private (Admin)
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    更新项目
// @route   PUT /api/projects/:id
// @access  Private (Admin)
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404)
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    删除项目
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的项目`, 404)
    );
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 