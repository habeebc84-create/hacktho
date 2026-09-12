/**
 * Client-side fallback engine for Cultivate Life RPG.
 * Used when backend server is offline or not yet connected on production deployments.
 * Implements the exact same XP formula, difficulty rewards, and streak multiplier as the server.
 */

export function sunlightRequiredForStage(stage) {
  return Math.round(100 * Math.pow(stage, 1.45));
}

export const DIFFICULTY_REWARDS = {
  easy:   { sunlight: 15, nutrients: 3 },
  medium: { sunlight: 30, nutrients: 7 },
  hard:   { sunlight: 60, nutrients: 15 },
};

export function computeStreakMultiplier(streak) {
  const bonus = Math.floor((streak || 0) / 3) * 0.05;
  return Math.min(1 + bonus, 1.5);
}

const DEFAULT_GARDEN = {
  garden: {
    seasonStreak: 3,
    lastActiveDate: new Date().toISOString(),
    longestStreak: 5,
    nutrients: 120,
  },
  growthTypes: {
    body:  { sunlight: 45, stage: 2 },
    mind:  { sunlight: 80, stage: 3 },
    craft: { sunlight: 20, stage: 1 },
    focus: { sunlight: 60, stage: 2 },
  },
  inventory: [{ itemId: 'shop_1', acquiredAt: new Date().toISOString() }],
  equippedTheme: 'default',
};

const DEFAULT_TASKS = [
  {
    _id: 'seed_body_1',
    title: '30-minute Morning Run or Yoga',
    growthType: 'body',
    difficulty: 'medium',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'seed_mind_1',
    title: 'Read 20 pages of a non-fiction book',
    growthType: 'mind',
    difficulty: 'easy',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'seed_craft_1',
    title: 'Ship 1 feature or practice guitar 30m',
    growthType: 'craft',
    difficulty: 'hard',
    status: 'active',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    _id: 'seed_focus_1',
    title: '45-minute deep work without distractions',
    growthType: 'focus',
    difficulty: 'medium',
    status: 'active',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const DEFAULT_SHOP = [
  { _id: 'shop_1', name: 'Cherry Blossom', description: 'A delicate pink flowering tree species for your garden.', type: 'species', cost: 20, imageKey: '🌸' },
  { _id: 'shop_2', name: 'Golden Sunflower', description: 'Radiates warm golden light into your Body plot.', type: 'species', cost: 35, imageKey: '🌻' },
  { _id: 'shop_3', name: 'Zen Bamboo', description: 'Strong, flexible bamboo that increases Focus plot aesthetics.', type: 'species', cost: 50, imageKey: '🎋' },
  { _id: 'shop_4', name: 'Ancient Bonsai', description: 'A wise centuries-old bonsai tree with glowing aura.', type: 'species', cost: 80, imageKey: '🌳' },
  { _id: 'shop_5', name: 'Autumn Amber Theme', description: 'A rich soil palette with golden fallen leaves and amber glow.', type: 'theme', cost: 60, imageKey: '🍂' },
  { _id: 'shop_6', name: 'Midnight Glow Theme', description: 'Cool indigo soil with bioluminescent plant accents.', type: 'theme', cost: 100, imageKey: '🌙' },
  { _id: 'shop_7', name: 'Stone Garden Lantern', description: 'A peaceful mossy stone lantern to illuminate your garden.', type: 'decoration', cost: 15, imageKey: '🏮' },
  { _id: 'shop_8', name: 'Shimmering Koi Pond', description: 'A crystal-clear mini pond with dancing orange koi fish.', type: 'decoration', cost: 40, imageKey: '🐟' },
];

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(`cultivate_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveState(key, val) {
  try {
    localStorage.setItem(`cultivate_${key}`, JSON.stringify(val));
  } catch (e) {
    // Ignore storage quota
  }
}

class MockBackend {
  constructor() {
    this.garden = loadState('garden_data', DEFAULT_GARDEN);
    this.tasks = loadState('tasks_data', DEFAULT_TASKS);
    this.growthLog = loadState('log_data', [
      { _id: 'log_1', growthType: 'body', sunlightEarned: 30, nutrientsEarned: 7, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { _id: 'log_2', growthType: 'mind', sunlightEarned: 45, nutrientsEarned: 10, timestamp: new Date(Date.now() - 86400000).toISOString() },
      { _id: 'log_3', growthType: 'focus', sunlightEarned: 30, nutrientsEarned: 7, timestamp: new Date().toISOString() },
    ]);
  }

  getGarden() {
    return JSON.parse(JSON.stringify(this.garden));
  }

  getTasks() {
    return JSON.parse(JSON.stringify(this.tasks));
  }

  createTask({ title, growthType, difficulty }) {
    const newTask = {
      _id: 'seed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      growthType: growthType || 'body',
      difficulty: difficulty || 'medium',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);
    saveState('tasks_data', this.tasks);
    return newTask;
  }

  completeTask(id) {
    const taskIndex = this.tasks.findIndex(t => t._id === id);
    const task = taskIndex >= 0 ? this.tasks[taskIndex] : { growthType: 'body', difficulty: 'medium' };

    const rewards = DIFFICULTY_REWARDS[task.difficulty] || DIFFICULTY_REWARDS.medium;
    const streak = (this.garden.garden.seasonStreak || 0) + 1;
    this.garden.garden.seasonStreak = streak;
    if (streak > (this.garden.garden.longestStreak || 0)) {
      this.garden.garden.longestStreak = streak;
    }
    this.garden.garden.lastActiveDate = new Date().toISOString();

    const multiplier = computeStreakMultiplier(streak);
    const sunlightEarned = Math.round(rewards.sunlight * multiplier);
    const nutrientsEarned = rewards.nutrients;

    // Apply sunlight to growth type
    const gt = this.garden.growthTypes[task.growthType] || { sunlight: 0, stage: 1 };
    gt.sunlight += sunlightEarned;
    const levelUps = [];
    let required = sunlightRequiredForStage(gt.stage);
    while (gt.sunlight >= required) {
      gt.sunlight -= required;
      gt.stage += 1;
      levelUps.push(gt.stage);
      required = sunlightRequiredForStage(gt.stage);
    }
    this.garden.growthTypes[task.growthType] = gt;
    this.garden.garden.nutrients = (this.garden.garden.nutrients || 0) + nutrientsEarned;

    // Mark task completed
    if (taskIndex >= 0) {
      this.tasks[taskIndex].status = 'completed';
      this.tasks[taskIndex].completedAt = new Date().toISOString();
      saveState('tasks_data', this.tasks);
    }

    // Append growth log
    const logEntry = {
      _id: 'log_' + Date.now(),
      taskId: id,
      growthType: task.growthType,
      sunlightEarned,
      nutrientsEarned,
      streakMultiplier: multiplier,
      timestamp: new Date().toISOString(),
    };
    this.growthLog.unshift(logEntry);
    saveState('log_data', this.growthLog);
    saveState('garden_data', this.garden);

    return {
      garden: this.garden.garden,
      growthTypes: this.garden.growthTypes,
      levelUps,
      sunlightEarned,
      nutrientsEarned,
      streakMultiplier: multiplier,
      winterDormancy: false,
    };
  }

  getShop() {
    return DEFAULT_SHOP;
  }

  purchaseItem(itemId) {
    const item = DEFAULT_SHOP.find(i => i._id === itemId || i.id === itemId);
    if (!item) throw new Error('Item not found');
    if ((this.garden.garden.nutrients || 0) < item.cost) {
      throw new Error('Not enough nutrients');
    }
    this.garden.garden.nutrients -= item.cost;
    this.garden.inventory.push({ itemId: item._id, acquiredAt: new Date().toISOString() });
    saveState('garden_data', this.garden);
    return { success: true, inventory: this.garden.inventory, nutrients: this.garden.garden.nutrients };
  }

  getGrowthLog() {
    return JSON.parse(JSON.stringify(this.growthLog));
  }
}

export const mockBackend = new MockBackend();
