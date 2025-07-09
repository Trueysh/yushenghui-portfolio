# 余胜辉的个人网站

这是一个完整的个人网站项目，包括前端展示、博客系统和管理后台。

## 功能特点

### 前端展示
- 响应式设计，适配各种设备
- 个人简介和技能展示
- 项目作品展示
- 联系表单

### 博客系统
- 文章发布和管理
- 分类和标签系统
- 评论功能
- 点赞功能
- 搜索功能

### 管理后台
- 仪表板数据统计
- 项目管理
- 博客文章管理
- 评论审核
- 留言管理
- 个人资料设置

## 技术栈

### 前端
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js (数据可视化)

### 后端
- Node.js
- Express.js
- MongoDB (数据库)
- EJS (模板引擎)
- JWT (身份验证)

## 项目结构

```
个人网址/
  - controllers/      # 控制器
  - middleware/       # 中间件
  - models/           # 数据模型
  - routes/           # 路由
  - uploads/          # 上传文件
  - views/            # 视图模板
    - admin/          # 管理后台视图
    - blog/           # 博客视图
    - layouts/        # 布局模板
    - partials/       # 部分视图
  - index.html        # 前端首页
  - script.js         # 前端脚本
  - style.css         # 前端样式
  - server.js         # 服务器入口
  - package.json      # 项目配置
  - .env              # 环境变量
```

## 安装和启动

### 前提条件
- Node.js (v14+)
- MongoDB (本地或MongoDB Atlas)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/yushenghui-portfolio.git
cd yushenghui-portfolio
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制`.env.example`文件为`.env`，并填写相应的配置信息：
```bash
cp .env.example .env
# 编辑.env文件，填写MongoDB连接字符串和其他配置
```

4. 创建管理员账户
```bash
node seed-admin.js
```

5. 启动服务器
```bash
npm run dev
```

6. 访问网站
- 前端网站: http://localhost:5000
- 博客: http://localhost:5000/blog
- 管理后台: http://localhost:5000/admin

## 部署

### 部署到生产环境
1. 设置环境变量`NODE_ENV=production`
2. 配置安全的MongoDB连接
3. 使用PM2或类似工具管理Node.js进程
4. 配置Nginx或其他Web服务器作为反向代理

## 许可证
MIT License

## 作者
余胜辉 - 大模型算法工程师
然后，使用MongoDB Shell或MongoDB Compass将该用户的角色更改为"admin"。