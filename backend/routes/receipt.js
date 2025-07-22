const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Order = require('../models/Order');
const { auth, admin } = require('./middleware');

// Generate receipt for an order (admin only, when order is completed)
router.post('/:orderId', auth, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Order must be completed to generate a receipt.' });
    }
    // Check if receipt already exists
    const existing = await Receipt.findOne({ order: order._id });
    if (existing) return res.status(400).json({ message: 'Receipt already exists for this order.' });
    const receipt = new Receipt({ order: order._id, total: order.total });
    await receipt.save();
    res.status(201).json(receipt);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all receipts (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const receipts = await Receipt.find().populate({ path: 'order', populate: { path: 'user' } });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's own receipts
router.get('/my', auth, async (req, res) => {
  try {
    const receipts = await Receipt.find().populate({ path: 'order', populate: { path: 'user' } });
    const userReceipts = receipts.filter(r => r.order.user._id.toString() === req.user.userId);
    res.json(userReceipts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single receipt (admin or owner)
router.get('/:id', auth, async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate({ path: 'order', populate: { path: 'user' } });
    if (!receipt) return res.status(404).json({ message: 'Receipt not found.' });
    if (req.user.role !== 'admin' && receipt.order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 