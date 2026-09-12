import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';

import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';

export default function SeedList({ seeds, onLevelUp, isLoading }) {
  const [activeTab, setActiveTab] = useState('body');
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const queryClient = useQueryClient();

  const tendMutation = useMutation({
    mutationFn: (id) => api.post(`/tasks/${id}/complete`),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], old =>
        old?.map(seed => seed._id === id ? { ...seed, tending: true } : seed)
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
      toast.error('The soil needs water. Connection lost — retrying...');
    },
    onSuccess: (data) => {
      const { sunlightEarned, levelUps } = data.data;
      toast.success(`☀️ +${sunlightEarned} Sunlight absorbed!`);
      if (levelUps?.length > 0) onLevelUp(levelUps[levelUps.length - 1]);
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['garden']);
    }
  });

  const createMutation = useMutation({
    mutationFn: (newSeed) => api.post('/tasks', newSeed),
    onSuccess: () => {
      toast.success('🌱 Seed planted! Tend it to grow.');
      setTitle('');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error ?? 'Failed to plant seed.');
    }
  });

  const handlePlant = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Seed title cannot be empty.');
      return;
    }
    setTitleError('');
    createMutation.mutate({ title: title.trim(), growthType: activeTab, difficulty });
  };

  const filteredSeeds = seeds?.filter(s => s.growthType === activeTab && s.status === 'active') ?? [];


  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20 h-full flex flex-col">
      <h2 className="font-display text-xl font-bold text-forest mb-4">🌱 Your Seeds</h2>

      {/* Growth Type Tabs */}
      <div className="flex gap-2 mb-5 border-b border-cream pb-3 overflow-x-auto" role="tablist">
        {[
          { key: 'body',  label: 'Body',  icon: '💪' },
          { key: 'mind',  label: 'Mind',  icon: '🧠' },
          { key: 'craft', label: 'Craft', icon: '🔨' },
          { key: 'focus', label: 'Focus', icon: '🎯' },
        ].map(type => (
          <button
            key={type.key}
            role="tab"
            aria-selected={activeTab === type.key}
            onClick={() => setActiveTab(type.key)}
            className={`px-3 py-1.5 rounded-full font-bold text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === type.key
                ? 'bg-forest text-cream'
                : 'text-forest hover:bg-cream'
            }`}
          >
            <span>{type.icon}</span>{type.label}
          </button>
        ))}
      </div>

      {/* Plant a Seed Form */}
      <form onSubmit={handlePlant} className="mb-5" noValidate>
        <div className="flex gap-2 mb-1">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }}
            placeholder="Describe your seed..."
            aria-label="Seed title"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'title-error' : undefined}
            className={`flex-1 bg-cream px-4 py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest text-sm ${titleError ? 'ring-2 ring-red-400' : ''}`}
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Seed difficulty"
            className="bg-cream px-3 py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest text-sm text-forest"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        {titleError && (
          <p id="title-error" role="alert" className="text-red-500 text-xs mt-1 ml-1">{titleError}</p>
        )}
        <button
          type="submit"
          className="mt-2 w-full bg-moss text-white py-2 rounded-xl font-bold hover:bg-forest transition-colors text-sm disabled:opacity-50"
          disabled={createMutation.isPending}
          aria-busy={createMutation.isPending}
        >
          {createMutation.isPending ? 'Planting...' : '🌱 Plant Seed'}
        </button>
      </form>

      {/* Seeds List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1" role="list" aria-label={`${activeTab} seeds`}>
        {isLoading ? (
          <div className="text-center py-8 text-soil/50 text-sm">Loading your garden...</div>
        ) : filteredSeeds.length === 0 ? (
          <div className="text-center py-10 text-soil/60 flex flex-col items-center gap-3">
            <div className="text-5xl opacity-40">🌱</div>
            <p className="text-sm">No seeds in this growth type yet.</p>
            <p className="text-xs opacity-60">Plant your first seed to begin your journey.</p>
          </div>
        ) : (
          filteredSeeds.map(seed => (
            <div
              key={seed._id}
              role="listitem"
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${seed.tending ? 'border-moss bg-moss/10 animate-pulse' : 'border-cream bg-cream/40 hover:border-moss/40'}`}
            >
              <div className="flex-1 min-w-0 mr-3">
                <h4 className="font-bold text-forest text-sm truncate">{seed.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${
                  seed.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  seed.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {seed.difficulty}
                </span>
              </div>
              <button
                onClick={() => tendMutation.mutate(seed._id)}
                disabled={seed.tending || tendMutation.isPending}
                aria-label={`Tend seed: ${seed.title}`}
                className="bg-sunlight/20 text-soil hover:bg-sunlight hover:text-forest px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 text-sm shrink-0 focus-visible:ring-2 focus-visible:ring-forest"
              >
                {seed.tending ? <Leaf className="w-4 h-4 animate-spin" /> : '☀️ Tend'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

