const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const teacherRoutes = require('./routes/teachers');
const teacherPositionRoutes = require('./routes/teacherPositions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/teachers', teacherRoutes);
app.use('/teacher-positions', teacherPositionRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Teacher Management API is running!' });
});

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công!');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
  });
