const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  total: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', receiptSchema);