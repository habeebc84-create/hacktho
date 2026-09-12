const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: { type: String, enum: ['species','theme','decoration'] },
  cost: { type: Number, required: true },
  unlockStageRequired: { type: Number, default: 1 },
  imageKey: String // frontend maps this to SVG
});

module.exports = mongoose.model('ShopItem', ShopItemSchema);
