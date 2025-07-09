const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    提交联系表单
// @route   POST /api/contact
// @access  公开
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // 创建联系记录
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });
    
    // 发送邮件通知
    await sendEmailNotification({
      name,
      email,
      subject,
      message
    });
    
    // 发送自动回复
    await sendAutoReply({
      name,
      email,
      subject
    });
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取所有联系表单信息
// @route   GET /api/contact
// @access  私有/管理员
exports.getContacts = async (req, res, next) => {
  try {
    // 分页
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Contact.countDocuments();
    
    // 排序
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // 默认按创建时间降序排序
    }
    
    const contacts = await Contact.find()
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
      
    // 分页结果
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      pagination,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取单个联系表单信息
// @route   GET /api/contact/:id
// @access  私有/管理员
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '找不到此联系信息'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新联系表单状态
// @route   PUT /api/contact/:id
// @access  私有/管理员
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '找不到此联系信息'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    删除联系表单
// @route   DELETE /api/contact/:id
// @access  私有/管理员
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '找不到此联系信息'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// 发送邮件通知
async function sendEmailNotification(contactData) {
  try {
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // 邮件选项
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `新联系表单提交: ${contactData.subject}`,
      html: `
        <h3>您收到了一条新的联系表单信息</h3>
        <p><strong>姓名:</strong> ${contactData.name}</p>
        <p><strong>邮箱:</strong> ${contactData.email}</p>
        <p><strong>主题:</strong> ${contactData.subject}</p>
        <p><strong>消息:</strong></p>
        <p>${contactData.message}</p>
      `
    };
    
    // 发送邮件
    await transporter.sendMail(mailOptions);
    console.log('邮件通知已发送');
  } catch (error) {
    console.error('邮件发送失败:', error);
  }
}

// 发送自动回复
async function sendAutoReply(contactData) {
  try {
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // 邮件选项
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: `自动回复: ${contactData.subject}`,
      html: `
        <h3>尊敬的 ${contactData.name}，您好！</h3>
        <p>感谢您的留言。我已收到您的消息，并将尽快回复。</p>
        <p>如有紧急事项，请直接联系我的邮箱：${process.env.EMAIL_USER}</p>
        <p>此致，</p>
        <p>余胜辉</p>
      `
    };
    
    // 发送邮件
    await transporter.sendMail(mailOptions);
    console.log('自动回复已发送');
  } catch (error) {
    console.error('自动回复发送失败:', error);
  }
} 