import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LevelUpCelebration({ stage, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const particles = Array.from({ length: 60 });

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-forest/90 backdrop-blur-sm"
      >
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.2, rotate: -20 }}
            animate={{ scale: [0.2, 1.5, 1.0], rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-9xl mb-8"
          >
            🌸
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-6xl font-display font-bold text-sunlight text-center"
          >
            Growth Stage: {stage || 'Bloom'}!
          </motion.h2>

          {particles.map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: i % 2 === 0 ? '#F2B84B' : '#E8A0A0',
                x: '-50%', y: '-50%' 
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
