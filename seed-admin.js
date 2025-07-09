const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入User模型
const User = require('./models/User');

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB连接成功'))
.catch((err) => {
  console.error('MongoDB连接失败:', err);
  process.exit(1);
});

// 管理员数据
const adminData = {
  username: '余胜辉',
  email: 'admin@example.com',
  password: 'admin123456',
  role: 'admin'
};

// 创建管理员账户
const createAdmin = async () => {
  try {
    // 检查管理员是否已存在
    const adminExists = await User.findOne({ email: adminData.email });
    
    if (adminExists) {
      console.log('管理员账户已存在');
      process.exit(0);
    }
    
    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    
    // 创建管理员
    const admin = await User.create({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });
    
    console.log('管理员账户创建成功');
    console.log('---------------------');
    console.log('登录信息：');
    console.log(`邮箱: ${adminData.email}`);
    console.log(`密码: ${adminData.password}`);
    console.log('---------------------');
    console.log('请妥善保管您的登录信息，并在登录后修改密码！');
    
    process.exit(0);
  } catch (error) {
    console.error('创建管理员账户失败:', error);
    process.exit(1);
  }
};

// 执行创建管理员操作
createAdmin(); 