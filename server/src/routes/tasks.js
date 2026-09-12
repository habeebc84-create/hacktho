const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const GrowthLog = require('../models/GrowthLog');
const { DIFFICULTY_REWARDS, computeStreakMultiplier, updateStreak, applySunlight } = require('../utils/gameEngine');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: { $in: ['active', 'completed'] } });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, growthType, difficulty, recurring, recurrenceRule } = req.body;
    
    if (!title || title.trim().length === 0 || title.length > 200) {
      return res.status(400).json({ error: 'Title is required and must be under 200 characters' });
    }
    if (!['body','mind','craft','focus'].includes(growthType)) {
      return res.status(400).json({ error: 'Invalid growthType' });
    }

    const newTask = new Task({
      userId: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      growthType,
      difficulty: difficulty || 'medium',
      recurring: recurring || false,
      recurrenceRule: recurrenceRule || ''
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { title, description, growthType, difficulty } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (growthType !== undefined) task.growthType = growthType;
    if (difficulty !== undefined) task.difficulty = difficulty;

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/complete', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.status === 'completed') return res.status(400).json({ error: 'Task already completed' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const baseRewards = DIFFICULTY_REWARDS[task.difficulty];
    const streakData = updateStreak(user.garden);
    const multiplier = computeStreakMultiplier(user.garden.seasonStreak);

    const sunlightEarned = Math.round(baseRewards.sunlight * multiplier);
    const nutrientsEarned = baseRewards.nutrients;

    const levelUps = applySunlight(user.growthTypes[task.growthType], sunlightEarned);
    user.garden.nutrients += nutrientsEarned;

    task.status = 'completed';
    task.completedAt = new Date();

    const logEntry = new GrowthLog({
      userId: user._id,
      taskId: task._id,
      growthType: task.growthType,
      sunlightEarned,
      nutrientsEarned,
      streakMultiplier: multiplier
    });

    await Promise.all([
      user.save(),
      task.save(),
      logEntry.save()
    ]);

    res.json({
      garden: user.garden,
      growthTypes: user.growthTypes,
      levelUps,
      sunlightEarned,
      nutrientsEarned,
      streakMultiplier: multiplier,
      winterDormancy: streakData.winterDormancy
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
