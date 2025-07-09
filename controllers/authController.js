const User = require('../models/User');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const asyncHandler = require('../middleware/errorHandler').asyncHandler;
const crypto = require('crypto');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // 创建用户
  const user = await User.create({
    username,
    email,
    password
  });

  sendTokenResponse(user, 201, res);
});

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 验证邮箱和密码
  if (!email || !password) {
    return next(new ErrorResponse('请提供邮箱和密码', 400));
  }

  // 检查用户
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('无效的凭证', 401));
  }

  // 检查密码
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('无效的凭证', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    退出登录 / 清除cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// 获取token，创建cookie并发送响应
const sendTokenResponse = (user, statusCode, res) => {
  // 创建token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}; 