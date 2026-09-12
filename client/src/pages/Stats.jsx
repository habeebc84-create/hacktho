import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Stats() {
  const lineData = [
    { day: 'Mon', Body: 10, Mind: 20, Craft: 0, Focus: 15 },
    { day: 'Tue', Body: 15, Mind: 25, Craft: 10, Focus: 20 },
    { day: 'Wed', Body: 20, Mind: 10, Craft: 30, Focus: 25 },
    { day: 'Thu', Body: 25, Mind: 30, Craft: 20, Focus: 10 },
    { day: 'Fri', Body: 10, Mind: 15, Craft: 40, Focus: 30 },
    { day: 'Sat', Body: 30, Mind: 40, Craft: 10, Focus: 35 },
    { day: 'Sun', Body: 40, Mind: 30, Craft: 20, Focus: 40 },
  ];

  const streakData = [
    { week: 'W1', streak: 7 },
    { week: 'W2', streak: 14 },
    { week: 'W3', streak: 21 },
    { week: 'W4', streak: 12 },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-forest mb-8">Garden Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
            <h3 className="text-soil mb-2 font-bold">Longest Season Cycle</h3>
            <p className="text-4xl font-display font-bold text-forest">21 Days</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
            <h3 className="text-soil mb-2 font-bold">Total Sunlight</h3>
            <p className="text-4xl font-display font-bold text-sunlight">1,420 ☀️</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
            <h3 className="text-soil mb-2 font-bold">Nutrients Gathered</h3>
            <p className="text-4xl font-display font-bold text-moss">850 🌿</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
            <h3 className="text-xl font-bold text-forest mb-6">Sunlight by Growth Type</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F7F3E9" />
                  <XAxis dataKey="day" stroke="#5A4632" />
                  <YAxis stroke="#5A4632" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="Body" stroke="#E8A0A0" strokeWidth={3} />
                  <Line type="monotone" dataKey="Mind" stroke="#7FA88C" strokeWidth={3} />
                  <Line type="monotone" dataKey="Craft" stroke="#F2B84B" strokeWidth={3} />
                  <Line type="monotone" dataKey="Focus" stroke="#1B3A2F" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-moss/20">
            <h3 className="text-xl font-bold text-forest mb-6">Streak History</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F7F3E9" />
                  <XAxis dataKey="week" stroke="#5A4632" />
                  <YAxis stroke="#5A4632" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="streak" fill="#7FA88C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
