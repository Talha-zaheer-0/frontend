import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    console.log('fetchUser: Token found in localStorage:', !!token);
    if (!token) {
      console.log('fetchUser: No token found, clearing user data');
      localStorage.removeItem('userId');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Validate token with JWT decode
      const decoded = jwtDecode(token);
      console.log('fetchUser: Decoded token:', decoded);
      if (!decoded.id && !decoded._id) {
        throw new Error('Invalid token: No id or _id field');
      }
      // Stringify _id to match likes array format
      const userId = (decoded.id || decoded._id)?.toString();
      const tempUser = { 
        _id: userId, 
        name: decoded.name || 'Anonymous', 
        isAdmin: decoded.isAdmin || false, 
        isOwner: decoded.isOwner || false 
      };
      setUser(tempUser);
      localStorage.setItem('userId', userId);
      console.log('fetchUser: Set temporary user from token:', tempUser);

      // Fetch user from backend (try /api/auth/me first, fallback to /me)
      let response;
      try {
        response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('fetchUser: /api/auth/me failed, trying /me:', err.message);
        response = await axios.get('http://localhost:5000/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      console.log('fetchUser: API response:', response.data);
      if (!response.data.user?.id && !response.data.user?._id) {
        throw new Error('Invalid API response: No id or _id in user object');
      }
      const apiUser = {
        _id: (response.data.user.id || response.data.user._id)?.toString(),
        name: response.data.user.name || 'Anonymous',
        email: response.data.user.email,
        isAdmin: response.data.user.isAdmin || false,
        isOwner: response.data.user.isOwner || false,
      };
      setUser(apiUser);
      localStorage.setItem('userId', apiUser._id);
      console.log('fetchUser: Set user from API:', apiUser);
    } catch (err) {
      console.error('fetchUser: Error:', err.message || err.response?.data || err);
      // Fallback to decoded token
      try {
        const decoded = jwtDecode(token);
        const userId = (decoded.id || decoded._id)?.toString();
        const tempUser = { 
          _id: userId, 
          name: decoded.name || 'Anonymous', 
          isAdmin: decoded.isAdmin || false, 
          isOwner: decoded.isOwner || false 
        };
        setUser(tempUser);
        localStorage.setItem('userId', userId);
        console.log('fetchUser: Fallback user set:', tempUser);
      } catch (decodeErr) {
        console.error('fetchUser: Token decode error:', decodeErr);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
        console.log('fetchUser: Cleared invalid token and userId');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect: Initializing fetchUser');
    fetchUser();
    const handleAuthChange = () => {
      console.log('useEffect: authChange event triggered');
      fetchUser();
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('login: Attempting login with email:', email);
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('login: API response:', response.data);
      if (!response.data.user?.id && !response.data.user?._id || !response.data.token) {
        throw new Error('Invalid login response: Missing user._id or token');
      }
      localStorage.setItem('token', response.data.token);
      const userId = (response.data.user.id || response.data.user._id)?.toString();
      localStorage.setItem('userId', userId);
      const apiUser = {
        _id: userId,
        name: response.data.user.name || 'Anonymous',
        email: response.data.user.email,
        isAdmin: response.data.user.isAdmin || false,
        isOwner: response.data.user.isOwner || false,
      };
      setUser(apiUser);
      console.log('login: User set:', apiUser);
      window.dispatchEvent(new Event('authChange'));
      return apiUser;
    } catch (err) {
      console.error('login: Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    console.log('logout: Clearing user data');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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