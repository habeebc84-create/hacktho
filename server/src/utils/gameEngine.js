// sunlight required to advance FROM stage N to N+1
function sunlightRequiredForStage(stage) {
  return Math.round(100 * Math.pow(stage, 1.45));
}

// Difficulty rewards
const DIFFICULTY_REWARDS = {
  easy:   { sunlight: 15, nutrients: 3 },
  medium: { sunlight: 30, nutrients: 7 },
  hard:   { sunlight: 60, nutrients: 15 }
};

// Streak multiplier: +5% per 3-day streak, cap at +50%
function computeStreakMultiplier(streak) {
  const bonus = Math.floor(streak / 3) * 0.05;
  return Math.min(1 + bonus, 1.5);
}

// Update streak based on lastActiveDate
function updateStreak(garden) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const last = garden.lastActiveDate ? new Date(garden.lastActiveDate) : null;
  if (last) last.setHours(0,0,0,0);

  if (!last) {
    garden.seasonStreak = 1;
  } else if (last.getTime() === today.getTime()) {
    // already counted today — no change
    return { streakChanged: false, winterDormancy: false };
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (last.getTime() === yesterday.getTime()) {
      garden.seasonStreak += 1;
    } else {
      garden.seasonStreak = 1; // reset — winter dormancy
      garden.lastActiveDate = today;
      if (garden.seasonStreak > garden.longestStreak) garden.longestStreak = garden.seasonStreak;
      return { streakChanged: true, winterDormancy: true };
    }
  }
  garden.lastActiveDate = today;
  if (garden.seasonStreak > garden.longestStreak) garden.longestStreak = garden.seasonStreak;
  return { streakChanged: true, winterDormancy: false };
}

// Apply sunlight and check for stage-up
function applySunlight(growthTypeObj, sunlightEarned) {
  const levelUps = [];
  growthTypeObj.sunlight += sunlightEarned;
  let required = sunlightRequiredForStage(growthTypeObj.stage);
  while (growthTypeObj.sunlight >= required) {
    growthTypeObj.sunlight -= required;
    growthTypeObj.stage += 1;
    levelUps.push(growthTypeObj.stage);
    required = sunlightRequiredForStage(growthTypeObj.stage);
  }
  return levelUps;
}

module.exports = { sunlightRequiredForStage, DIFFICULTY_REWARDS, computeStreakMultiplier, updateStreak, applySunlight };
