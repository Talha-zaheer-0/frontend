const express = require('express');
const router = express.Router();
const { getProductsByChild, searchProducts } = require('../controllers/productController');
const { query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.get(
  '/products',
  [query('page').optional().isInt({ min: 1 })],
  productLimiter,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getProductsByChild
);

router.get(
  '/products/search',
  [
    query('query').optional().isString().trim().isLength({ max: 100 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  productLimiter,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  searchProducts
);

module.exports = router;