import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched user:', response.data.user);
        setUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user:', err.response?.data || err.message);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    const handleAuthChange = () => fetchUser();
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      window.dispatchEvent(new Event('authChange'));
      return response.data.user;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};