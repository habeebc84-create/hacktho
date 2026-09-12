import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Heart, Hammer, Target } from 'lucide-react';

export default function Landing() {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="min-h-screen bg-cream overflow-hidden relative font-body text-forest">
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full bg-sunlight opacity-50"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -100], x: [0, Math.random() * 50 - 25], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          className="text-6xl md:text-8xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-forest to-moss"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Cultivate Your Growth
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-soil max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Turn your life's journey into a beautiful garden. Plant seeds, tend to them daily, and watch yourself bloom.
        </motion.p>

        <motion.div 
          className="flex gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/signup" className="px-8 py-4 bg-forest text-cream rounded-full font-bold hover:bg-moss transition-colors shadow-lg">
            Start Planting
          </Link>
          <Link to="/login" className="px-8 py-4 border-2 border-forest text-forest rounded-full font-bold hover:bg-forest hover:text-cream transition-colors">
            Visit Garden
          </Link>
        </motion.div>

        {/* 3D Garden Preview */}
        <div className="perspective-garden w-full max-w-4xl mx-auto h-64 mb-20">
          <motion.div 
            className="w-full h-full bg-soil rounded-3xl grid grid-cols-4 gap-4 p-8 border-b-8 border-forest glow-moss"
            style={{ rotateX: '25deg' }}
            initial={{ rotateX: '45deg', y: 100, opacity: 0 }}
            animate={{ rotateX: '25deg', y: 0, opacity: 1 }}
            transition={{ duration: 1, type: 'spring' }}
          >
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-forest/20 rounded-xl border border-moss/30 flex items-center justify-center">
                <span className="text-4xl plant-sway inline-block">🌱</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {[
            { icon: Heart, title: 'Body', color: 'text-bloom' },
            { icon: Brain, title: 'Mind', color: 'text-moss' },
            { icon: Hammer, title: 'Craft', color: 'text-sunlight' },
            { icon: Target, title: 'Focus', color: 'text-soil' }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-moss/20"
              whileHover={{ y: -5 }}
            >
              <feat.icon className={`w-12 h-12 mb-4 mx-auto ${feat.color}`} />
              <h3 className="font-display text-xl font-bold mb-2">{feat.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
      <footer className="text-center py-8 text-soil/60">
        <p>Cultivate — Nurture Your True Nature</p>
      </footer>
    </div>
  );
}
