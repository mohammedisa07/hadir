const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { auth, admin } = require('./middleware');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create menu item (no auth for now)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, available, category, isPopular } = req.body;
    const item = new MenuItem({ name, description, price, imageUrl, available, category, isPopular });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update menu item (no auth for now)
router.put('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete menu item (no auth for now)
router.delete('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 