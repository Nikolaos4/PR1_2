import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from '../api'; // предположим, что apiClient экспортируется

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При монтировании проверяем, есть ли токен в localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      // Дополнительно можно загрузить данные пользователя с /api/auth/me
      apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(response => setUser(response.data))
        .catch(() => logout()) // если токен невалидный – разлогиниваем
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    // загружаем пользователя
    const userResponse = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setUser(userResponse.data);
  };

  const register = async (userData) => {
    const response = await apiClient.post('/auth/registr', userData);
    // после успешной регистрации можно сразу залогинить
    await login(userData.email, userData.password);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};