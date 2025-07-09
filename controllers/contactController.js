const Contact = require('../models/Contact');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const asyncHandler = require('../middleware/errorHandler').asyncHandler;

// @desc    创建联系表单提交
// @route   POST /api/contact
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    data: contact
  });
});

// @desc    获取所有联系表单提交
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = asyncHandler(async (req, res, next) => {
  // 分页
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Contact.countDocuments();

  const contacts = await Contact.find()
    .sort({ createdAt: -1 })
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
});

// @desc    获取单个联系表单提交
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的联系表单`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    更新联系表单状态
// @route   PUT /api/contact/:id
// @access  Private (Admin)
exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的联系表单`, 404)
    );
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    删除联系表单
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`未找到ID为${req.params.id}的联系表单`, 404)
    );
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 