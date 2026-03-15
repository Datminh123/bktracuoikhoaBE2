const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

// GET /teachers - Lấy danh sách giáo viên (có populate và phân trang)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Teacher.countDocuments();

    const teachers = await Teacher.find()
      .populate('userId', 'name email phoneNumber address identity dob')
      .populate('teacherPositionsId', 'name code des isActive')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Hàm tạo mã giáo viên ngẫu nhiên 10 chữ số, unique
const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const found = await Teacher.findOne({ code });
    exists = !!found;
  }
  return code;
};

// POST /teachers - Tạo mới giáo viên
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phoneNumber, address, identity, dob,
      startDate, endDate, teacherPositionsId, degrees, isActive,
    } = req.body;

    // Kiểm tra email đã tồn tại chưa
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: 'Email đã tồn tại trong hệ thống!',
        });
      }
    }

    // Tạo User
    const user = new User({
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      role: 'TEACHER',
      isDeleted: false,
    });
    await user.save();

    // Tạo mã giáo viên unique
    const code = await generateUniqueCode();

    // Tạo Teacher
    const teacher = new Teacher({
      userId: user._id,
      code,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: false,
      startDate: startDate || new Date(),
      endDate,
      teacherPositionsId: teacherPositionsId || [],
      degrees: degrees || [],
    });
    await teacher.save();

    // Populate để trả về đầy đủ thông tin
    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('userId', 'name email phoneNumber address identity dob')
      .populate('teacherPositionsId', 'name code des isActive');

    res.status(201).json({
      status: true,
      message: 'Tạo giáo viên thành công!',
      data: populatedTeacher,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
