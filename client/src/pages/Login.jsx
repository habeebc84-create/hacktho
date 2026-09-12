import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import api from '../config/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
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
      <div className="hidden md:flex w-1/2 bg-forest flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-moss via-forest to-forest"></div>
        <svg width="200" height="200" viewBox="0 0 100 100" className="z-10 drop-shadow-2xl">
          <path d="M50 90 Q 50 40 50 20" fill="none" stroke="#7FA88C" strokeWidth="4" />
          <path d="M50 60 Q 30 50 40 70" fill="#7FA88C" />
          <path d="M50 40 Q 70 30 60 50" fill="#7FA88C" />
          <circle cx="50" cy="20" r="10" fill="#F2B84B" />
        </svg>
        <h2 className="text-cream text-4xl font-display font-bold mt-8 z-10">Welcome Back</h2>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-moss/20">
          <h1 className="text-3xl font-display font-bold text-center mb-8 text-forest">Login to Cultivate</h1>
          
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
            disabled={loading || !email || !password}
            className="w-full bg-forest text-cream py-4 rounded-xl font-bold text-lg hover:bg-moss transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Entering Garden...' : 'Enter Garden'}
          </button>

          <p className="text-center text-soil mt-6">
            Don't have a garden yet? <Link to="/signup" className="font-bold hover:text-forest underline">Plant a seed</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
