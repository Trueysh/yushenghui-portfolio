// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // 记录错误到控制台
  console.error(err);
  
  // Mongoose 错误 - 错误的ObjectId
  if (err.name === 'CastError') {
    const message = `找不到ID为${err.value}的资源`;
    error = { message };
  }
  
  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message };
  }
  
  // Mongoose 重复键错误
  if (err.code === 11000) {
    const message = '输入了重复的值';
    error = { message };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '服务器错误'
  });
};

module.exports = errorHandler; 