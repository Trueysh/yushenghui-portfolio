const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

// @desc    获取所有项目
// @route   GET /api/projects
// @access  公开
exports.getProjects = async (req, res, next) => {
  try {
    // 构建查询
    let query = {};
    
    // 根据分类筛选
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // 是否只返回精选项目
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // 分页
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(query);
    
    // 排序
    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort = { order: 1, createdAt: -1 }; // 默认按顺序和创建时间排序
    }
    
    // 执行查询
    const projects = await Project.find(query)
      .sort(sort)
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
  } catch (error) {
    next(error);
  }
};

// @desc    获取单个项目
// @route   GET /api/projects/:id
// @access  公开
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: '找不到此项目'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    创建项目
// @route   POST /api/projects
// @access  私有/管理员
exports.createProject = async (req, res, next) => {
  try {
    // 创建项目
    const project = await Project.create(req.body);
    
    // 如果有文件上传
    if (req.file) {
      project.image = req.file.filename;
      await project.save();
    }
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新项目
// @route   PUT /api/projects/:id
// @access  私有/管理员
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: '找不到此项目'
      });
    }
    
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // 如果有文件上传
    if (req.file) {
      // 删除旧图片
      if (project.image !== 'default.jpg') {
        const imagePath = path.join(__dirname, '../uploads', project.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // 更新图片路径
      project.image = req.file.filename;
      await project.save();
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    删除项目
// @route   DELETE /api/projects/:id
// @access  私有/管理员
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: '找不到此项目'
      });
    }
    
    // 删除相关图片
    if (project.image !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../uploads', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // 删除项目
    await project.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 