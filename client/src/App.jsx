import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './store/authStore';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GardenDashboard from './pages/GardenDashboard';

const Greenhouse = lazy(() => import('./pages/Greenhouse'));
const Stats = lazy(() => import('./pages/Stats'));

const queryClient = new QueryClient();

function GardenLoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center flex-col gap-4">
      <div className="text-5xl animate-bounce">🌱</div>
      <p className="font-display text-2xl text-forest font-bold">Cultivating your garden...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { state } = useAuth();
  if (state.loading) return <GardenLoadingScreen />;
  if (!state.user) return <Navigate to="/login" />;
  return children;
}


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/garden" element={<ProtectedRoute><GardenDashboard /></ProtectedRoute>} />
      <Route path="/seeds" element={<Navigate to="/garden" replace />} />

      
      <Route path="/greenhouse" element={
        <ProtectedRoute>
          <Suspense fallback={<GardenLoadingScreen />}>
            <Greenhouse />
          </Suspense>
        </ProtectedRoute>
      } />
      
      <Route path="/stats" element={
        <ProtectedRoute>
          <Suspense fallback={<GardenLoadingScreen />}>
            <Stats />
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
