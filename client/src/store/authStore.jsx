import React, { createContext, useReducer, useEffect, useContext } from 'react';
import api from '../config/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  accessToken: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, accessToken: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to get user info — the interceptor will auto-refresh the token if needed
        const res = await api.get('/auth/me');
        if (res.data?.user) {
          dispatch({ type: 'SET_USER', payload: res.data.user });
        }
      } catch (err) {
        // Not authenticated — that's fine, user will be redirected by ProtectedRoute
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
