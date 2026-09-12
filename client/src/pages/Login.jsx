import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import api from '../config/api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { dispatch }            = useAuth();
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.accessToken) {
        dispatch({ type: 'SET_TOKEN', payload: res.data.accessToken });
      }
      dispatch({ type: 'SET_USER', payload: res.data.user });
      navigate('/garden');
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream text-forest font-body">
      {/* Decorative Panel */}
      <div className="hidden md:flex w-1/2 bg-forest flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{background: 'radial-gradient(circle at center, #7FA88C, #1B3A2F)'}} />
        <svg width="200" height="200" viewBox="0 0 100 100" className="z-10 drop-shadow-2xl">
          <path d="M50 90 Q 50 40 50 20" fill="none" stroke="#7FA88C" strokeWidth="4" />
          <path d="M50 60 Q 30 50 40 70" fill="#7FA88C" />
          <path d="M50 40 Q 70 30 60 50" fill="#7FA88C" />
          <circle cx="50" cy="20" r="10" fill="#F2B84B" />
        </svg>
        <h2 className="text-cream text-4xl font-display font-bold mt-8 z-10">Welcome Back</h2>
        <p className="text-cream/70 mt-2 z-10">Your garden has been waiting.</p>
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="max-w-md w-full space-y-5 bg-white p-8 rounded-3xl shadow-sm border border-moss/20" noValidate>
          <h1 className="text-3xl font-display font-bold text-center mb-6 text-forest">Enter Your Garden</h1>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="font-bold text-sm text-forest">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest transition-shadow"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="font-bold text-sm text-forest">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest transition-shadow"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-cream py-4 rounded-xl font-bold text-lg hover:bg-moss transition-colors shadow-md disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? 'Entering Garden...' : '🌿 Enter Garden'}
          </button>

          <button
            type="button"
            onClick={() => {
              const demoUser = { id: 'demo_user', displayName: 'Master Gardener', email: 'gardener@cultivate.app' };
              localStorage.setItem('cultivate_user', JSON.stringify(demoUser));
              dispatch({ type: 'SET_USER', payload: demoUser });
              navigate('/garden');
            }}
            className="w-full bg-sunlight/20 text-forest border border-sunlight/50 py-3 rounded-xl font-bold text-sm hover:bg-sunlight transition-colors flex items-center justify-center gap-2"
          >
            <span>✨</span> Explore Instantly in Demo Mode
          </button>

          <p className="text-center text-soil mt-4">
            Don't have a garden yet?{' '}
            <Link to="/signup" className="font-bold text-forest hover:text-moss underline">Plant a seed</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
