const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { auth, admin } = require('./middleware');

// Place a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items } = req.body; // [{ menuItem, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }
    // Calculate total
    let total = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.available) {
        return res.status(400).json({ message: 'Invalid or unavailable menu item.' });
      }
      total += menuItem.price * item.quantity;
    }
    const order = new Order({ user: req.user.userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all orders (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's own orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single order (admin or owner)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.menuItem');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 