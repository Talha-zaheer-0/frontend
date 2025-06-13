const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../services/emailService');
const { emitNotification } = require('../services/socketService');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const signup = async (req, res) => {
  const { email, password, role, adminAccess } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    const user = new User({
      email,
      password: hashedPassword,
      role,
      adminAccess: role === 'admin' ? adminAccess : '',
      verificationToken,
    });
    await user.save();

    await sendVerificationEmail(email, verificationToken);
    emitNotification('signupNotification', `New user signed up: ${email}`, user._id.toString());
    res.status(201).json({ message: 'Signup successful! Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = '';
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: `Invalid or expired token: ${err.message}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, adminAccess: user.adminAccess }, JWT_SECRET, { expiresIn: '1h' });
    emitNotification('loginNotification', `User logged in: ${email}`, user._id.toString());
    res.json({ token, role: user.role, adminAccess: user.adminAccess });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

module.exports = { signup, verifyEmail, login };