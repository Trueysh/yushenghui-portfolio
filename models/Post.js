const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请提供文章标题'],
    trim: true,
    maxlength: [100, '标题不能超过100个字符']
  },
  slug: {
    type: String,
    required: [true, '请提供文章别名'],
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, '请提供文章内容']
  },
  excerpt: {
    type: String,
    required: [true, '请提供文章摘要'],
    maxlength: [200, '摘要不能超过200个字符']
  },
  coverImage: {
    type: String,
    default: 'default-post.jpg'
  },
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    enum: ['人工智能', '大模型', '全栈开发', '前端', '后端', '技术思考', '教程', '其他'],
    required: true
  }],
  status: {
    type: String,
    enum: ['草稿', '已发布'],
    default: '草稿'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新文章时更新更新日期
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 发布文章时设置发布日期
PostSchema.pre('save', function(next) {
  if (this.status === '已发布' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  next();
});

// 生成文章URL
PostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

module.exports = mongoose.model('Post', PostSchema); 