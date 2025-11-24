import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { apiHelper } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setError('');
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError('');
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        return { success: true, data: res.data };
      }
    } catch (error) {
      const errorMessage = apiHelper.handleError(error);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const sanitizedData = apiHelper.sanitizeData(userData);
      const res = await api.post('/auth/register', sanitizedData);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        return { success: true, data: res.data };
      }
    } catch (error) {
      const errorMessage = apiHelper.handleError(error);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};