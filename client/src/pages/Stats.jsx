import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import api from '../config/api';
import { useGarden } from '../hooks/useGarden';

function useGrowthLog() {
  return useQuery({
    queryKey: ['growthLog'],
    queryFn: async () => {
      const { data } = await api.get('/garden/log');
      return data;
    },
  });
}

// Group logs by date and growthType → [{ date, body, mind, craft, focus }]
function buildChartData(logs) {
  if (!logs?.length) return [];
  const byDate = {};
  logs.forEach(log => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!byDate[date]) byDate[date] = { date, body: 0, mind: 0, craft: 0, focus: 0 };
    byDate[date][log.growthType] += log.sunlightEarned;
  });
  return Object.values(byDate).slice(-14); // last 14 days
}

export default function Stats() {
  const navigate = useNavigate();
  const { data: garden } = useGarden();
  const { data: logs, isLoading } = useGrowthLog();

  const chartData  = buildChartData(logs);
  const totalSunlight   = logs?.reduce((s, l) => s + l.sunlightEarned, 0) ?? 0;
  const totalNutrients  = logs?.reduce((s, l) => s + l.nutrientsEarned, 0) ?? 0;
  const longestStreak   = garden?.garden?.longestStreak ?? 0;
  const currentStreak   = garden?.garden?.seasonStreak ?? 0;

  // Streak bar data — one bar per log entry grouped by week
  const streakData = [
    { week: 'Current', streak: currentStreak },
    { week: 'Best',    streak: longestStreak },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <button onClick={() => navigate('/garden')} className="text-soil hover:text-forest text-sm underline mb-4 block">
          ← Back to Garden
        </button>
        <h1 className="text-4xl font-display font-bold text-forest mb-2">📊 Garden Analytics</h1>
        <p className="text-soil/70 mb-8">Your growth history over the last 14 days.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Current Season Cycle', value: `${currentStreak} Days`, color: 'text-moss' },
            { label: 'Longest Season Cycle', value: `${longestStreak} Days`, color: 'text-forest' },
            { label: 'Total Sunlight Earned', value: `${totalSunlight} ☀️`,  color: 'text-sunlight' },
            { label: 'Nutrients Gathered',    value: `${totalNutrients} 🌿`, color: 'text-moss' },
          ].map(card => (
            <div key={card.label} className="bg-white p-5 rounded-3xl shadow-sm border border-moss/20">
              <h3 className="text-soil/70 text-xs font-bold uppercase tracking-wider mb-2">{card.label}</h3>
              <p className={`text-3xl font-display font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-soil/50">Loading your growth history...</div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-moss/20">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="font-display text-2xl font-bold text-forest mb-2">No growth history yet</h3>
            <p className="text-soil/60">Tend your first seed to start tracking your growth.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sunlight by Growth Type */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
              <h3 className="text-xl font-bold text-forest mb-6">☀️ Sunlight by Growth Type</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F7F3E9" />
                    <XAxis dataKey="date" stroke="#5A4632" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#5A4632" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #7FA88C', fontSize: 12 }} />
                    <Legend />
                    <Line type="monotone" dataKey="body"  name="Body"  stroke="#E8A0A0" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="mind"  name="Mind"  stroke="#64B5F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="craft" name="Craft" stroke="#F2B84B" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="focus" name="Focus" stroke="#BA68C8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Streak Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
              <h3 className="text-xl font-bold text-forest mb-6">🌿 Season Cycle</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F7F3E9" />
                    <XAxis dataKey="week" stroke="#5A4632" />
                    <YAxis stroke="#5A4632" />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #7FA88C' }} />
                    <Bar dataKey="streak" name="Days" fill="#7FA88C" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-soil/50 text-xs mt-4">
                Keep tending daily to build longer season cycles!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
