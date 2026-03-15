const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  identity: {
    type: String,
  },
  dob: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    default: 'TEACHER',
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');

