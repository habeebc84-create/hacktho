const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShopItem = require('../models/ShopItem');

dotenv.config();

const items = [
  { name: 'Fern', description: 'A beginner-friendly resilient fern.', type: 'species', cost: 20, unlockStageRequired: 1, imageKey: 'fern' },
  { name: 'Bonsai Tree', description: 'Requires focus and patience.', type: 'species', cost: 40, unlockStageRequired: 2, imageKey: 'bonsai' },
  { name: 'Orchid', description: 'Beautiful but delicate.', type: 'species', cost: 60, unlockStageRequired: 3, imageKey: 'orchid' },
  { name: 'Monstera', description: 'A large tropical plant.', type: 'species', cost: 80, unlockStageRequired: 3, imageKey: 'monstera' },
  { name: 'Dark Theme', description: 'A sleek dark mode for your garden.', type: 'theme', cost: 50, unlockStageRequired: 2, imageKey: 'dark_theme' },
  { name: 'Zen Garden Theme', description: 'A peaceful environment.', type: 'theme', cost: 100, unlockStageRequired: 3, imageKey: 'zen_theme' },
  { name: 'Pebbles', description: 'Small decorative pebbles.', type: 'decoration', cost: 15, unlockStageRequired: 1, imageKey: 'pebbles' },
  { name: 'Fairy Lights', description: 'Warm glowing lights.', type: 'decoration', cost: 30, unlockStageRequired: 1, imageKey: 'fairy_lights' }
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cultivate';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    await ShopItem.deleteMany({});
    console.log('Cleared existing shop items');

    await ShopItem.insertMany(items);
    console.log('Successfully seeded shop items');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding shop items:', err);
    process.exit(1);
  }
}

seed();
