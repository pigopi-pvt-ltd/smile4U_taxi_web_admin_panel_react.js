import { create } from 'zustand';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (identifier, password) => {
    set({ loading: true });
    try {
      // First, login to get tokens
      const loginResponse = await authService.login(identifier, password);
      console.log('Login response:', loginResponse.data);
      
      // Extract tokens from response
      const { accessToken, refreshToken, user: userData } = loginResponse.data;
      
      // Store tokens in localStorage
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // If user data is returned directly from login, use it
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        set({ 
          user: userData, 
          isAuthenticated: true, 
          loading: false 
        });
        toast.success(`Welcome back, ${userData.name || userData.email}!`);
        return true;
      }
      
      // Otherwise fetch user profile
      const userResponse = await authService.getCurrentUser();
      console.log('User profile response:', userResponse.data);
      
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      set({ 
        user: userResponse.data, 
        isAuthenticated: true, 
        loading: false 
      });
      toast.success(`Welcome back, ${userResponse.data.name || userResponse.data.email}!`);
      return true;
      
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return null;
    }
    
    set({ loading: true });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, loading: false });
      return null;
    }
  },

  registerCustomer: async (userData) => {
    set({ loading: true });
    try {
      const response = await authService.registerCustomer(userData);
      toast.success('Registration successful! Please verify your email.');
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  verifyEmail: async (userId, otp) => {
    set({ loading: true });
    try {
      const response = await authService.verifyEmail(userId, otp);
      toast.success('Email verified successfully!');
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Verification failed');
      throw error;
    }
  },

  // Initialize auth state from localStorage
  initialize: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        set({ 
          user: JSON.parse(user), 
          isAuthenticated: true, 
          loading: false 
        });
        return true;
      } catch (e) {
        console.error('Error parsing user:', e);
        return false;
      }
    }
    return false;
  },
}));

// Initialize the store when imported
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}

export default useAuthStore;