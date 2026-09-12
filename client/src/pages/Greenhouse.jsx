import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGarden } from '../hooks/useGarden';
import { useShop } from '../hooks/useShop';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function Greenhouse() {
  const navigate = useNavigate();
  const { data: garden } = useGarden();
  const { shopQuery, purchaseItem } = useShop();
  const nutrients = garden?.garden?.nutrients ?? 0;
  const inventory = garden?.inventory ?? [];
  const items = shopQuery.data ?? [];

  const isOwned = (itemId) => inventory.some(i => i.itemId === String(itemId));

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <button onClick={() => navigate('/garden')} className="text-soil hover:text-forest text-sm underline mb-2 block">
              ← Back to Garden
            </button>
            <h1 className="text-4xl font-display font-bold text-forest">🏡 The Greenhouse</h1>
            <p className="text-soil/70 mt-1">Spend your nutrients on cosmetic upgrades for your garden.</p>
          </div>
          <div className="bg-forest text-cream px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-md text-lg">
            <span>🌿</span> {nutrients} Nutrients
          </div>
        </div>

        {/* Loading */}
        {shopQuery.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 h-64 shimmer border border-moss/10" />
            ))}
          </div>
        )}

        {/* Items grid — falls back to demo items if DB empty */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items.length > 0 ? items : DEMO_ITEMS).map((item, i) => {
            const owned = isOwned(item._id ?? item.id);
            const canAfford = nutrients >= item.cost;
            const locked = !canAfford && !owned;

            return (
              <motion.div
                key={item._id ?? item.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={owned ? {} : { y: -4 }}
                className={`bg-white rounded-3xl p-6 shadow-sm border relative overflow-hidden ${
                  owned ? 'border-moss/40' : locked ? 'border-soil/20 opacity-80' : 'border-moss/20'
                }`}
              >
                {/* Lock overlay */}
                {locked && !owned && (
                  <div className="absolute inset-0 bg-cream/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-3xl">
                    <span className="text-3xl mb-2">🔒</span>
                    <p className="font-bold text-soil text-sm">Need {item.cost} 🌿</p>
                  </div>
                )}

                <div className="text-6xl mb-4">{item.imageKey ?? item.icon ?? '🌿'}</div>
                <span className="text-xs uppercase tracking-wider text-soil/50 font-bold">{item.type}</span>
                <h3 className="text-xl font-bold text-forest mt-1 mb-2">{item.name}</h3>
                <p className="text-soil/80 text-sm mb-6 min-h-[40px]">{item.description}</p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-sunlight flex items-center gap-1">
                    🌿 {item.cost}
                  </span>
                  {owned ? (
                    <span className="bg-moss/20 text-forest px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1">
                      ✅ Owned
                    </span>
                  ) : (
                    <button
                      onClick={() => purchaseItem.mutate(item._id ?? item.id)}
                      disabled={locked || purchaseItem.isPending}
                      className="bg-forest text-cream px-4 py-2 rounded-xl font-bold text-sm hover:bg-moss transition-colors disabled:opacity-40"
                    >
                      {purchaseItem.isPending ? '...' : 'Exchange'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {!shopQuery.isLoading && items.length === 0 && (
          <p className="text-center text-soil/50 mt-12 text-sm">
            Run <code className="bg-cream px-2 py-1 rounded">node src/seeds/shopItems.js</code> in the server to populate the shop.
          </p>
        )}
      </div>
    </div>
  );
}

// Demo items shown when DB shop is empty
const DEMO_ITEMS = [
  { id: 1, name: 'Cherry Blossom',   description: 'A delicate pink flowering tree species.', type: 'species',     cost: 20,  icon: '🌸', imageKey: '🌸' },
  { id: 2, name: 'Sunflower Patch',  description: 'Bright yellow sunflowers for your Body plot.', type: 'species', cost: 35,  icon: '🌻', imageKey: '🌻' },
  { id: 3, name: 'Bamboo Grove',     description: 'Tall elegant bamboo for your Focus plot.', type: 'species',     cost: 50,  icon: '🎋', imageKey: '🎋' },
  { id: 4, name: 'Autumn Theme',     description: 'Warm orange and gold garden aesthetic.', type: 'theme',         cost: 75,  icon: '🍂', imageKey: '🍂' },
  { id: 5, name: 'Moonlight Theme',  description: 'A cool midnight garden with glowing plants.', type: 'theme',    cost: 100, icon: '🌙', imageKey: '🌙' },
  { id: 6, name: 'Stone Lantern',    description: 'A peaceful stone lantern decoration.',   type: 'decoration',    cost: 15,  icon: '🏮', imageKey: '🏮' },
  { id: 7, name: 'Koi Pond',         description: 'A shimmering koi pond for your garden.', type: 'decoration',   cost: 30,  icon: '🐟', imageKey: '🐟' },
  { id: 8, name: 'Ancient Bonsai',   description: 'A wise ancient bonsai tree.',            type: 'species',       cost: 80,  icon: '🌳', imageKey: '🌳' },
];
