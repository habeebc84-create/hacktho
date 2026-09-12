import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import api from '../config/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      navigate('/garden');
    } catch (err) {
      // Handle error visually
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream text-forest font-body">
      <div className="hidden md:flex w-1/2 bg-moss flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-forest via-moss to-moss"></div>
        <svg width="200" height="200" viewBox="0 0 100 100" className="z-10 drop-shadow-2xl">
          <path d="M50 90 L 50 60" fill="none" stroke="#1B3A2F" strokeWidth="6" />
          <path d="M50 60 Q 30 50 40 70" fill="#1B3A2F" />
          <path d="M50 60 Q 70 50 60 70" fill="#1B3A2F" />
        </svg>
        <h2 className="text-forest text-4xl font-display font-bold mt-8 z-10">Start Your Journey</h2>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSignup} className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-moss/20">
          <h1 className="text-3xl font-display font-bold text-center mb-8 text-forest">Create Your Garden</h1>
          
          <div className="space-y-2">
            <label className="font-bold text-sm">Your Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest transition-shadow"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest transition-shadow"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-sm">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest transition-shadow"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !password || !name}
            className="w-full bg-forest text-cream py-4 rounded-xl font-bold text-lg hover:bg-moss transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Preparing Soil...' : 'Plant the First Seed'}
          </button>

          <p className="text-center text-soil mt-6">
            Already have a garden? <Link to="/login" className="font-bold hover:text-forest underline">Visit it</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
