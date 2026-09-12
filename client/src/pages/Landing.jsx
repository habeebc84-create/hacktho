import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Heart, Hammer, Target } from 'lucide-react';
import { useAuth } from '../store/authStore';

export default function Landing() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  const handleEnterDemo = () => {
    const demoUser = {
      id: 'demo_gardener',
      displayName: 'Master Gardener',
      email: 'gardener@cultivate.app',
    };
    localStorage.setItem('cultivate_user', JSON.stringify(demoUser));
    dispatch({ type: 'SET_USER', payload: demoUser });
    navigate('/garden');
  };

  return (
    <div className="min-h-screen bg-cream overflow-hidden relative font-body text-forest">
      {/* Ambient Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2.5 h-2.5 rounded-full bg-sunlight opacity-50 pointer-events-none"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -120], x: [0, Math.random() * 50 - 25], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center text-center">
        {/* Thematic Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-moss/20 text-forest text-sm font-bold mb-6"
        >
          <span>🌱</span> A Living-Growth Life RPG
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-forest via-moss to-forest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Cultivate Your Growth
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-soil max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Reframe your productivity as a living garden. Plant real-world seeds, absorb sunlight, and watch your growth domains visibly bloom.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleEnterDemo}
            className="px-8 py-4 bg-sunlight text-forest rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span>🌿</span> Enter Demo Garden
          </button>
          <Link
            to="/signup"
            className="px-8 py-4 bg-forest text-cream rounded-full font-bold text-lg hover:bg-moss transition-all shadow-md"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-forest text-forest rounded-full font-bold text-lg hover:bg-forest hover:text-cream transition-colors"
          >
            Sign In
          </Link>
        </motion.div>

        {/* 3D Garden Preview */}
        <div className="perspective-garden w-full max-w-4xl mx-auto h-56 md:h-64 mb-16">
          <motion.div
            className="w-full h-full bg-gradient-to-b from-soil/90 to-forest rounded-3xl grid grid-cols-4 gap-4 p-6 md:p-8 border-b-8 border-forest glow-moss"
            style={{ transform: 'rotateX(20deg)', transformOrigin: 'top center' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { icon: '🌸', name: 'Body', stage: 'Bloom' },
              { icon: '🧠', name: 'Mind', stage: 'Sprout' },
              { icon: '🔨', name: 'Craft', stage: 'Bud' },
              { icon: '🎯', name: 'Focus', stage: 'Tree' },
            ].map((plant, i) => (
              <div
                key={i}
                className="bg-forest/30 rounded-2xl border border-moss/30 flex flex-col items-center justify-center p-2 backdrop-blur-sm"
              >
                <span className="text-3xl md:text-5xl plant-sway inline-block mb-1">{plant.icon}</span>
                <span className="text-cream text-xs font-bold">{plant.name}</span>
                <span className="text-sunlight text-[10px] opacity-80">{plant.stage}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4 Growth Type Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {[
            { icon: Heart, title: 'Body', desc: 'Fitness, sleep & vitality', color: 'text-bloom' },
            { icon: Brain, title: 'Mind', desc: 'Reading, learning & meditation', color: 'text-moss' },
            { icon: Hammer, title: 'Craft', desc: 'Projects, coding & skills', color: 'text-sunlight' },
            { icon: Target, title: 'Focus', desc: 'Deep work & discipline', color: 'text-soil' },
          ].map((feat, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-moss/20 hover:border-moss/50 transition-all text-center"
              whileHover={{ y: -4 }}
            >
              <feat.icon className={`w-10 h-10 mb-3 mx-auto ${feat.color}`} />
              <h3 className="font-display text-xl font-bold mb-1 text-forest">{feat.title}</h3>
              <p className="text-xs text-soil/70">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="text-center py-8 text-soil/60 text-sm border-t border-moss/10">
        <p>Cultivate — Nurture Your True Nature • 2024</p>
      </footer>
    </div>
  );
}
