const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// 加载环境变量
dotenv.config();

// 导入路由
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 5000;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false // 在生产环境中应配置适当的CSP
}));

// 设置速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP 15分钟内限制100个请求
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression()); // 压缩响应

// 设置模板引擎
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// 静态文件服务
app.use(express.static(path.join(__dirname, './')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// API路由
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 管理员路由
app.use('/admin', adminRoutes);

// 公共前端博客路由
app.get('/blog', (req, res) => {
  res.render('blog/index', {
    title: '我的博客',
    layout: 'layouts/blog'
  });
});

app.get('/blog/:slug', (req, res) => {
  res.render('blog/post', {
    title: '博客文章',
    layout: 'layouts/blog'
  });
});

// 前端路由处理，确保SPA正常工作
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

// 错误处理中间件
app.use(errorHandler);

// 处理404
app.use((req, res) => {
  res.status(404).render('404', {
    title: '页面未找到',
    layout: 'layouts/error'
  });
});

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB连接成功'))
.catch((err) => console.error('MongoDB连接失败:', err));

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
}); 