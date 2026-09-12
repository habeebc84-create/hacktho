const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const GrowthLog = require('../models/GrowthLog');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('garden growthTypes inventory equippedTheme');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      garden: user.garden,
      growthTypes: user.growthTypes,
      inventory: user.inventory,
      equippedTheme: user.equippedTheme
    });
  } catch (err) {
    next(err);
  }
});

router.get('/log', async (req, res, next) => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const logs = await GrowthLog.find({ 
      userId: req.user.id,
      timestamp: { $gte: ninetyDaysAgo }
    }).sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
