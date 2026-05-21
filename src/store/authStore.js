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
      const response = await authService.login(identifier, password);
      // Get user profile after successful login
      const userResponse = await authService.getCurrentUser();
      set({ 
        user: userResponse.data, 
        isAuthenticated: true, 
        loading: false 
      });
      toast.success('Login successful!');
      return true;
    } catch (error) {
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
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    }
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
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

  verifyEmail: async (email, otp) => {
    set({ loading: true });
    try {
      const response = await authService.verifyEmail(email, otp);
      toast.success('Email verified successfully!');
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Verification failed');
      throw error;
    }
  },
}));

export default useAuthStore;