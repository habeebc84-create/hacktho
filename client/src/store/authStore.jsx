import React, { createContext, useReducer, useEffect, useContext } from 'react';
import api, { setAccessToken } from '../config/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  accessToken: localStorage.getItem('cultivate_token') || null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      setAccessToken(action.payload);
      return { ...state, accessToken: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGOUT':
      setAccessToken(null);
      return { ...initialState, accessToken: null, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // 1. If we already have an access token stored, check current user
        if (state.accessToken) {
          try {
            const meRes = await api.get('/auth/me');
            if (isMounted && meRes.data?.user) {
              dispatch({ type: 'SET_USER', payload: meRes.data.user });
              dispatch({ type: 'SET_LOADING', payload: false });
              return;
            }
          } catch (e) {
            // Token may have expired, proceed to refresh attempt
          }
        }

        // 2. Try to refresh token using httpOnly cookie
        const refreshRes = await api.post('/auth/refresh');
        if (isMounted && refreshRes.data?.accessToken) {
          dispatch({ type: 'SET_TOKEN', payload: refreshRes.data.accessToken });
          if (refreshRes.data.user) {
            dispatch({ type: 'SET_USER', payload: refreshRes.data.user });
          } else {
            const meRes = await api.get('/auth/me');
            if (isMounted) {
              dispatch({ type: 'SET_USER', payload: meRes.data?.user || null });
            }
          }
        } else if (isMounted) {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (err) {
        // Not authenticated — visitor is a guest
        if (isMounted) {
          dispatch({ type: 'LOGOUT' });
        }
      } finally {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      /* ignore */
    }
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
