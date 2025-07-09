const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由，确保用户已登录
exports.protect = async (req, res, next) => {
  let token;
  
  // 检查请求头中是否包含token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // 检查token是否存在
  if (!token) {
    return res.status(401).json({ success: false, message: '没有访问权限，请先登录' });
  }
  
  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 根据token中的ID查找用户
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: '找不到此用户' });
    }
    
    // 将用户信息添加到请求对象中
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token无效或已过期' });
  }
};

// 确保用户具有特定角色的中间件
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '没有访问权限，请先登录' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: '没有足够的权限执行此操作' });
    }
    
    next();
  };
}; 