const express = require('express');
const router = express.Router();
const { addToCart, getCart, validateAddToCart } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

router.post('/cart/add', validateAddToCart, authenticateToken, cartLimiter, addToCart);
router.get('/cart', authenticateToken, cartLimiter, getCart);

module.exports = router;