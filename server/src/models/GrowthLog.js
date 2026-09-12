const mongoose = require('mongoose');

const GrowthLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  growthType: String,
  sunlightEarned: Number,
  nutrientsEarned: Number,
  streakMultiplier: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GrowthLog', GrowthLogSchema);
