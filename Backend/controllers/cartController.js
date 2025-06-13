const Cart = require('../models/cart');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: 'Product not found' });
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) return res.status(400).json({ message: 'Item already in cart' });

    const cartItem = new Cart({ userId, productId });
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate('productId');
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

module.exports = { addToCart, getCart, validateAddToCart: [body('productId').isMongoId()] };