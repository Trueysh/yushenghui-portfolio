# 余胜辉 - 个人网站

这是我的个人网站源代码，展示我作为大模型算法工程师的技能和项目经验。

## 访问网站

您可以通过以下链接访问我的个人网站：
[https://trueysh.github.io/yushenghui-portfolio/](https://trueysh.github.io/yushenghui-portfolio/)

## 技术栈

### 前端
- HTML5
- CSS3
- JavaScript
- Three.js
- AOS动画库
- Particles.js

### 后端
- Node.js
- Express
- MongoDB
- JWT认证
- Nodemailer

## 功能

- 响应式设计
- 技能展示
- 项目展示
- 作品集
- 联系表单（连接后端API）
- 管理员后台（用于管理项目和留言）

## 安装与运行

### 前提条件
- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆仓库
```
git clone https://github.com/Trueysh/yushenghui-portfolio.git
cd yushenghui-portfolio
```

2. 安装依赖
```
npm install
```

3. 创建环境变量文件
创建一个名为`.env`的文件，包含以下内容：
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
NODE_ENV=development
```

4. 启动MongoDB数据库

5. 运行应用
```
npm run dev  # 开发模式
```
或
```
npm start    # 生产模式
```

6. 访问网站
在浏览器中打开 [http://localhost:5000](http://localhost:5000)

## API端点

### 认证
- POST /api/auth/register - 注册新用户
- POST /api/auth/login - 用户登录
- GET /api/auth/me - 获取当前用户信息

### 联系表单
- POST /api/contact - 提交联系表单
- GET /api/contact - 获取所有留言 (需管理员权限)
- GET /api/contact/:id - 获取单个留言 (需管理员权限)
- PUT /api/contact/:id - 更新留言状态 (需管理员权限)
- DELETE /api/contact/:id - 删除留言 (需管理员权限)

### 项目
- GET /api/projects - 获取所有项目
- GET /api/projects/:id - 获取单个项目
- POST /api/projects - 创建新项目 (需管理员权限)
- PUT /api/projects/:id - 更新项目 (需管理员权限)
- DELETE /api/projects/:id - 删除项目 (需管理员权限)

## 部署

### 前端
前端部分使用GitHub Pages部署。

### 后端
后端部署可以使用如下选项：
- Heroku
- AWS
- DigitalOcean
- 其他云服务提供商

## 管理员账户设置

首次运行应用后，您需要创建一个管理员账户。您可以使用以下API创建：

```
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "secure_password"
}
```

然后，使用MongoDB Shell或MongoDB Compass将该用户的角色更改为"admin"。