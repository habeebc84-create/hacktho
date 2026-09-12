const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true, trim: true, maxlength: 40 },
  createdAt: { type: Date, default: Date.now },
  garden: {
    seasonStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    longestStreak: { type: Number, default: 0 },
    nutrients: { type: Number, default: 0 }
  },
  growthTypes: {
    body:  { sunlight: { type: Number, default: 0 }, stage: { type: Number, default: 1 } },
    mind:  { sunlight: { type: Number, default: 0 }, stage: { type: Number, default: 1 } },
    craft: { sunlight: { type: Number, default: 0 }, stage: { type: Number, default: 1 } },
    focus: { sunlight: { type: Number, default: 0 }, stage: { type: Number, default: 1 } }
  },
  inventory: [{ itemId: String, acquiredAt: { type: Date, default: Date.now } }],
  equippedTheme: { type: String, default: 'default' },
  refreshTokenHash: { type: String } // store hashed refresh token
});

module.exports = mongoose.model('User', UserSchema);
