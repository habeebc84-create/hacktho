/**
 * Client-side game engine utility — mirrors server-side logic for UI display only.
 * XP awards are ALWAYS calculated server-side. This is only used for progress bar display.
 */

export const STAGE_NAMES = {
  1: 'Seed',
  2: 'Sprout',
  3: 'Bud',
  4: 'Bloom',
  5: 'Tree',
  6: 'Ancient Tree',
};

export function sunlightRequiredForStage(stage) {
  return Math.round(100 * Math.pow(stage, 1.45));
}

export const GROWTH_TYPE_META = {
  body:  { label: 'Body',  icon: '💪', accent: '#E57373' },
  mind:  { label: 'Mind',  icon: '🧠', accent: '#64B5F6' },
  craft: { label: 'Craft', icon: '🔨', accent: '#F2B84B' },
  focus: { label: 'Focus', icon: '🎯', accent: '#BA68C8' },
};
