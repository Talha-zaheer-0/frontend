const nodemailer = require('nodemailer');
const retry = require('async-retry');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/auth/verify?token=${token}`;
  try {
    await retry(
      async () => {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Verify Your Email - ShopEasy',
          html: `<p>Welcome to ShopEasy! Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
        });
      },
      { retries: 3 }
    );
  } catch (err) {
    throw new Error(`Email sending failed: ${err.message}`);
  }
};

module.exports = { sendVerificationEmail };