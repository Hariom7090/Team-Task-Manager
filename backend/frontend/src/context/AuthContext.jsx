import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // ✅ FIX: Added fallback URL - this is the important line!
  const API_URL = import.meta.env.VITE_API_URL || 'https://team-task-manager-production-d2fc.up.railway.app';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      console.log('User restored:', JSON.parse(storedUser).email);
    }
    setLoading(false);
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      // This is the line you asked about - it's right here!
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });

      const { user: userData, token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      setToken(authToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // ================= REGISTER =================
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });

      const { user: userData, token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      setToken(authToken);
      setUser(userData);

      toast.success(`Welcome ${userData.name}!`);
      return true;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};