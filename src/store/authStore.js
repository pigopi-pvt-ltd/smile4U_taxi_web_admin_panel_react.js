
import { create } from 'zustand';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  login: async (identifier, password) => {
    set({ loading: true });
    try {
      const response = await authService.login(identifier, password);
      const { user, accessToken } = response.data;
      
      // Store token and user
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user: user, 
        isAuthenticated: true, 
        loading: false 
      });
      
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      set({ 
        user: JSON.parse(user), 
        isAuthenticated: true 
      });
      return true;
    }
    return false;
  },

  getCurrentUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
}));

export default useAuthStore;