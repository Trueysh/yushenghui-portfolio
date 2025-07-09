const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请提供您的姓名'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '请提供您的邮箱'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请提供有效的邮箱地址'
    ]
  },
  subject: {
    type: String,
    required: [true, '请提供主题'],
    trim: true
  },
  message: {
    type: String,
    required: [true, '请提供消息内容'],
    trim: true
  },
  status: {
    type: String,
    enum: ['未读', '已读', '已回复'],
    default: '未读'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', ContactSchema); 