import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import api from '../config/api';

export default function Signup() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { dispatch }            = useAuth();
  const navigate                = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !displayName) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { displayName, email, password });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      navigate('/garden');
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream text-forest font-body">
      {/* Decorative Panel */}
      <div className="hidden md:flex w-1/2 bg-moss flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{background: 'radial-gradient(circle at center, #1B3A2F, #7FA88C)'}} />
        <svg width="200" height="200" viewBox="0 0 100 100" className="z-10 drop-shadow-2xl">
          <path d="M50 90 L 50 60" fill="none" stroke="#1B3A2F" strokeWidth="6" />
          <path d="M50 60 Q 30 50 40 70" fill="#1B3A2F" />
          <path d="M50 60 Q 70 50 60 70" fill="#1B3A2F" />
        </svg>
        <h2 className="text-forest text-4xl font-display font-bold mt-8 z-10">Start Your Journey</h2>
        <p className="text-forest/70 mt-2 z-10">Every great garden starts with a single seed.</p>
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSignup} className="max-w-md w-full space-y-5 bg-white p-8 rounded-3xl shadow-sm border border-moss/20" noValidate>
          <h1 className="text-3xl font-display font-bold text-center mb-6 text-forest">Create Your Garden</h1>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="displayName" className="font-bold text-sm text-forest">Your Garden Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Green Thumb George"
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest transition-shadow"
              required
            />
          </div>

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
              placeholder="At least 8 characters"
              className="w-full bg-cream px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest transition-shadow"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-cream py-4 rounded-xl font-bold text-lg hover:bg-moss transition-colors shadow-md disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? 'Preparing Soil...' : '🌱 Plant the First Seed'}
          </button>

          <p className="text-center text-soil mt-4">
            Already have a garden?{' '}
            <Link to="/login" className="font-bold text-forest hover:text-moss underline">Visit it</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
