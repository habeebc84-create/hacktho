const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000 },
  growthType: { type: String, enum: ['body','mind','craft','focus'], required: true },
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'medium' },
  status: { type: String, enum: ['active','completed','archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  recurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }
});

module.exports = mongoose.model('Task', TaskSchema);
