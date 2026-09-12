import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlantSVG from '../components/plants/PlantSVG';
import SeedList from '../components/SeedList';
import LevelUpCelebration from '../components/LevelUpCelebration';
import SkeletonLoader from '../components/SkeletonLoader';
import { useGarden } from '../hooks/useGarden';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../store/authStore';
import { sunlightRequiredForStage } from '../utils/gameEngine';

const STAGE_NAMES = ['', 'Seed', 'Sprout', 'Bud', 'Bloom', 'Tree', 'Ancient Tree'];

const GROWTH_TYPES = [
  { key: 'body',  label: 'Body',  icon: '💪', accent: '#E57373' },
  { key: 'mind',  label: 'Mind',  icon: '🧠', accent: '#64B5F6' },
  { key: 'craft', label: 'Craft', icon: '🔨', accent: '#F2B84B' },
  { key: 'focus', label: 'Focus', icon: '🎯', accent: '#BA68C8' },
];

function getSeason(streak, winterDormancy) {
  if (winterDormancy) return { name: 'Winter Dormancy', icon: '❄️', color: 'text-blue-300' };
  if (streak < 8)  return { name: 'Spring', icon: '🌱', color: 'text-moss' };
  if (streak < 22) return { name: 'Summer', icon: '☀️', color: 'text-sunlight' };
  if (streak < 50) return { name: 'Autumn', icon: '🍂', color: 'text-soil' };
  return { name: 'Ancient Season', icon: '✨', color: 'text-sunlight' };
}

export default function GardenDashboard() {
  const navigate = useNavigate();
  const { state: { user }, logout } = useAuth();
  const { data: garden, isLoading: gardenLoading } = useGarden();
  const { tasksQuery, createTask } = useTasks();
  const [levelUpData, setLevelUpData] = useState(null);
  const [showSeedForm, setShowSeedForm] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickType, setQuickType] = useState('body');
  const [quickDiff, setQuickDiff] = useState('medium');

  const handleQuickPlant = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    createTask.mutate(
      { title: quickTitle.trim(), growthType: quickType, difficulty: quickDiff },
      {
        onSuccess: () => {
          setQuickTitle('');
          setShowSeedForm(false);
        }
      }
    );
  };

  const winterDormancy = garden?.garden?.seasonStreak === 0 && garden?.garden?.lastActiveDate;
  const streak = garden?.garden?.seasonStreak ?? 0;
  const nutrients = garden?.garden?.nutrients ?? 0;
  const season = getSeason(streak, false);

  if (gardenLoading) return <SkeletonLoader />;

  return (
    <div className={`min-h-screen bg-cream p-4 md:p-8 font-body transition-all duration-1000 ${winterDormancy ? 'saturate-[0.3]' : ''}`}>
      <AnimatePresence>
        {levelUpData && (
          <LevelUpCelebration
            stage={STAGE_NAMES[levelUpData] ?? `Stage ${levelUpData}`}
            onClose={() => setLevelUpData(null)}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-forest">🌱 Cultivate</h1>
        </div>

        {/* Season Cycle Indicator */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`flex items-center gap-2 font-display font-bold text-lg ${season.color}`}
        >
          <span className="text-2xl">{season.icon}</span>
          <div className="hidden sm:block">
            <div>{season.name}</div>
            <div className="text-xs font-body font-normal opacity-70">Day {streak} Season Cycle</div>
          </div>
        </motion.div>

        {/* Nutrients + User */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/greenhouse')}
            className="bg-forest text-cream px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:bg-moss transition-colors"
            role="link"
            aria-label={`${nutrients} nutrients — open Greenhouse`}
          >
            <span>🌿</span>
            <span>{nutrients}</span>
          </motion.div>
          <button
            onClick={logout}
            className="text-soil hover:text-forest text-sm underline"
            aria-label="Log out of Cultivate"
          >
            Leave garden
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="max-w-7xl mx-auto mb-6">
        <h2 className="font-display text-3xl font-bold text-forest">
          Welcome back, {user?.displayName ?? 'Gardener'} 🌿
        </h2>
        <p className="text-soil/70 mt-1">Your garden is {streak > 0 ? 'flourishing' : 'waiting for your care'} today.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 3D Garden Grid */}
        <div className="lg:col-span-2 perspective-garden">
          <motion.div
            className="w-full bg-gradient-to-b from-soil/80 to-forest rounded-3xl grid grid-cols-2 gap-6 p-6 md:p-8 border-b-[12px] border-forest glow-moss"
            style={{ transform: 'rotateX(8deg)', transformOrigin: 'top center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {GROWTH_TYPES.map((gt, i) => {
              const gtData = garden?.growthTypes?.[gt.key] ?? { sunlight: 0, stage: 1 };
              const stage = gtData.stage ?? 1;
              const sunlight = gtData.sunlight ?? 0;
              const required = sunlightRequiredForStage(stage);
              const progress = Math.min((sunlight / required) * 100, 100);

              return (
                <motion.div
                  key={gt.key}
                  className="bg-forest/30 backdrop-blur-sm rounded-2xl border border-moss/30 relative flex flex-col items-center p-4 cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.04, translateY: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="w-full flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{gt.icon}</span>
                      <span className="text-cream font-bold text-sm">{gt.label}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: gt.accent + '33', color: gt.accent }}
                    >
                      {STAGE_NAMES[stage] ?? `Stage ${stage}`}
                    </span>
                  </div>

                  {/* Sunlight Progress Bar */}
                  <div className="w-full mb-4" aria-label={`${gt.label} sunlight progress: ${Math.round(progress)}%`}>
                    <div className="flex justify-between text-xs text-cream/50 mb-1">
                      <span>☀️ {sunlight}</span>
                      <span>{required} needed</span>
                    </div>
                    <div className="w-full h-2 bg-forest/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${gt.accent}88, ${gt.accent})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Plant SVG */}
                  <div className="flex-1 flex items-end justify-center w-full min-h-[120px]">
                    <PlantSVG type={gt.key} stage={stage} accentColor={gt.accent} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Nav Links */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/stats')}
              className="text-sm text-soil hover:text-forest underline"
            >
              📊 View Growth History
            </button>
            <button
              onClick={() => navigate('/greenhouse')}
              className="text-sm text-soil hover:text-forest underline"
            >
              🏡 Visit Greenhouse
            </button>
          </div>
        </div>

        {/* Seeds Sidebar */}
        <div className="lg:col-span-1">
          <SeedList
            seeds={tasksQuery.data ?? []}
            onLevelUp={setLevelUpData}
            isLoading={tasksQuery.isLoading}
          />
        </div>
      </div>

      {/* Floating Action Button — Quick Plant */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSeedForm(true)}
        className="fixed bottom-6 right-6 bg-moss text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl glow-moss z-30"
        aria-label="Plant a new seed"
      >
        +
      </motion.button>

      {/* Quick Plant Seed Slide-Up Modal */}
      <AnimatePresence>
        {showSeedForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-forest/70 backdrop-blur-sm p-4"
            onClick={() => setShowSeedForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-moss/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl font-bold text-forest">🌱 Plant a New Seed</h3>
                <button
                  onClick={() => setShowSeedForm(false)}
                  className="text-soil/60 hover:text-forest text-2xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickPlant} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-forest mb-1">Seed Title</label>
                  <input
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="e.g. 20 min morning meditation..."
                    className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest text-sm text-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-forest mb-1">Growth Domain</label>
                  <div className="grid grid-cols-4 gap-2">
                    {GROWTH_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type.key}
                        onClick={() => setQuickType(type.key)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          quickType === type.key
                            ? 'bg-forest text-cream shadow-md scale-105'
                            : 'bg-cream text-forest hover:bg-moss/20'
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-forest mb-1">Difficulty & Sunlight</label>
                  <select
                    value={quickDiff}
                    onChange={(e) => setQuickDiff(e.target.value)}
                    className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest text-sm text-forest"
                  >
                    <option value="easy">Easy — 15 ☀️ Sunlight, 3 🌿 Nutrients</option>
                    <option value="medium">Medium — 30 ☀️ Sunlight, 7 🌿 Nutrients</option>
                    <option value="hard">Hard — 60 ☀️ Sunlight, 15 🌿 Nutrients</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSeedForm(false)}
                    className="flex-1 py-3 border border-soil/20 rounded-xl font-bold text-soil hover:bg-cream transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTask.isPending}
                    className="flex-1 py-3 bg-forest text-cream rounded-xl font-bold hover:bg-moss transition-colors shadow-md text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>🌱</span> {createTask.isPending ? 'Planting...' : 'Plant Seed'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
