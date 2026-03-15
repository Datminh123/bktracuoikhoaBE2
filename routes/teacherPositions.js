const express = require('express');
const router = express.Router();
const TeacherPosition = require('../models/TeacherPosition');

// GET /teacher-positions - Lấy danh sách vị trí công tác
router.get('/', async (req, res) => {
  try {
    const positions = await TeacherPosition.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      data: positions,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// POST /teacher-positions - Tạo mới vị trí công tác
router.post('/', async (req, res) => {
  try {
    const { name, code, des, isActive } = req.body;

    // Kiểm tra code đã tồn tại chưa
    const existingPosition = await TeacherPosition.findOne({ code });
    if (existingPosition) {
      return res.status(400).json({
        status: false,
        message: 'Mã vị trí công tác đã tồn tại!',
      });
    }

    const position = new TeacherPosition({
      name,
      code,
      des,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: false,
    });
    await position.save();

    res.status(201).json({
      status: true,
      message: 'Tạo vị trí công tác thành công!',
      data: position,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
