const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  isGraduated: {
    type: Boolean,
    default: false,
  },
});

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  teacherPositionsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherPosition',
  }],
  degrees: [degreeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema, 'teachers');
