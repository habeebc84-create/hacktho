const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ShopItem = require('../models/ShopItem');
const User = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/purchase/:itemId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const item = await ShopItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const alreadyOwned = user.inventory.some(inv => inv.itemId === item._id.toString());
    if (alreadyOwned) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    if (user.garden.nutrients < item.cost) {
      return res.status(400).json({ error: 'Not enough nutrients' });
    }

    // Check growthType stage requirements (assuming it requires max stage across all growthTypes >= unlockStageRequired)
    const maxStage = Math.max(
      user.growthTypes.body.stage,
      user.growthTypes.mind.stage,
      user.growthTypes.craft.stage,
      user.growthTypes.focus.stage
    );

    if (maxStage < item.unlockStageRequired) {
      return res.status(403).json({ error: 'Growth stage too low to purchase this item' });
    }

    user.garden.nutrients -= item.cost;
    user.inventory.push({ itemId: item._id.toString(), acquiredAt: new Date() });

    await user.save();

    res.json({
      inventory: user.inventory,
      nutrients: user.garden.nutrients
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
