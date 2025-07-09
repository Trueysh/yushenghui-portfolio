const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请提供项目标题'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '请提供项目描述'],
    trim: true
  },
  features: [String],
  technologies: [String],
  image: {
    type: String,
    default: 'default.jpg'
  },
  githubLink: {
    type: String,
    trim: true
  },
  demoLink: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, '请提供项目类别'],
    enum: ['AI', '全栈', '前端', '后端', '移动应用', '其他']
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema); 