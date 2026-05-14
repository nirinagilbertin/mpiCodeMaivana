import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (via cookie session)
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    setUser(response.data.data);
    return response.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  const register = async (userData) => {
    const response = await api.post('/users/register', userData);
    setUser(response.data.data);
    return response.data;
  };

  const value = { user, loading, login, logout, register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};