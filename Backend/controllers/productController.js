const User = require('../models/user');
const Product = require('../models/Product');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProductsByChild = async (req, res) => {
  try {
    const { page = 1, adminAccess } = req.query;
    const limit = 6;
    const skip = (page - 1) * limit;
    const childUsers = await User.find({ adminAccess: 'child' }).distinct('_id');
    const products = await Product.find({ addedBy: { $in: childUsers } })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query = '', adminAccess, page = 1 } = req.query;
    const limit = 6;
    const skip = (page - 1) * limit;
    const childUsers = await User.find({ adminAccess: 'child' }).distinct('_id');
    const products = await Product.find({
      addedBy: { $in: childUsers },
      name: { $regex: escapeRegExp(query), $options: 'i' },
    })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

module.exports = { getProductsByChild, searchProducts };