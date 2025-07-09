const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 生成JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    注册用户
// @route   POST /api/auth/register
// @access  公开
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已被使用'
      });
    }
    
    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
      role: 'user' // 默认为普通用户
    });
    
    // 生成token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    登录用户
// @route   POST /api/auth/login
// @access  公开
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 检查是否提供了邮箱和密码
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }
    
    // 查找用户并获取密码
    const user = await User.findOne({ email }).select('+password');
    
    // 检查用户是否存在
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的凭据'
      });
    }
    
    // 检查密码是否匹配
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '无效的凭据'
      });
    }
    
    // 生成token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取当前登录用户的信息
// @route   GET /api/auth/me
// @access  私有
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}; 