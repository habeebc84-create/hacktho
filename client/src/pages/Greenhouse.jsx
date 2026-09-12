import React from 'react';
import { motion } from 'framer-motion';

export default function Greenhouse() {
  // Mock data for UI
  const shopItems = [
    { id: 1, name: 'Mystic Fertilizer', desc: 'Boosts next tend by 20%', cost: 150, icon: '✨', owned: false },
    { id: 2, name: 'Golden Watering Can', desc: 'Unlock special ancient stage', cost: 500, icon: '🪴', owned: false, locked: true },
    { id: 3, name: 'Crystal Soil', desc: 'Protects streak from one miss', cost: 300, icon: '💎', owned: true },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-bold text-forest">The Greenhouse</h1>
          <div className="bg-forest text-cream px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
            <span>🌿</span> 450 Nutrients
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={item.locked ? {} : { y: -5 }}
              className={`bg-white rounded-3xl p-6 shadow-sm border ${item.locked ? 'border-soil/20 opacity-75' : 'border-moss/20'} relative overflow-hidden`}
            >
              {item.locked && (
                <div className="absolute inset-0 bg-cream/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-2">🔒</span>
                  <p className="font-bold text-soil">Requires Bloom Stage</p>
                </div>
              )}
              
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-forest mb-2">{item.name}</h3>
              <p className="text-soil mb-6 h-12">{item.desc}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-sunlight flex items-center gap-1">
                  <span>🌿</span> {item.cost}
                </span>
                {item.owned ? (
                  <span className="bg-moss/20 text-forest px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    ✅ Owned
                  </span>
                ) : (
                  <button className="bg-forest text-cream px-4 py-2 rounded-xl font-bold hover:bg-moss transition-colors">
                    Exchange
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
