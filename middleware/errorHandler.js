/**
 * 错误处理中间件
 */

// 错误响应格式化函数
const formatErrorResponse = (err) => {
  // 默认错误对象
  const error = {
    success: false,
    message: err.message || '服务器错误',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  };

  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
  }

  // 处理Mongoose重复键错误
  if (err.code === 11000) {
    error.message = `${Object.keys(err.keyValue).join(', ')} 字段已存在，请使用其他值`;
    error.statusCode = 400;
  }

  // 处理Mongoose CastError（格式错误）
  if (err.name === 'CastError') {
    error.message = `无效的 ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    error.message = '无效的授权令牌';
    error.statusCode = 401;
  }

  // 处理JWT过期错误
  if (err.name === 'TokenExpiredError') {
    error.message = '授权令牌已过期，请重新登录';
    error.statusCode = 401;
  }

  return {
    error,
    statusCode: err.statusCode || error.statusCode || 500
  };
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const { error, statusCode } = formatErrorResponse(err);
  
  // API 请求返回JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(statusCode).json(error);
  }

  // 网页请求：登录错误
  if (req.originalUrl === '/admin/login' && statusCode === 401) {
    return res.status(statusCode).render('admin/login', {
      title: '管理员登录',
      error: error.message,
      user: null
    });
  }

  // 网页请求：404错误
  if (statusCode === 404) {
    return res.status(404).render('404', {
      title: '页面未找到',
      layout: 'layouts/error'
    });
  }

  // 网页请求：其他错误
  res.status(statusCode).render('admin/error', {
    title: '错误',
    message: error.message,
    user: req.user,
    layout: statusCode === 401 ? 'layouts/error' : 'layouts/main'
  });
};

module.exports = errorHandler; 