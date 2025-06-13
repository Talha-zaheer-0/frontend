const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  adminAccess: { type: String, enum: ['owner', 'child', ''], default: '' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);