import api from '../utils/httpClient';

const authService = {
  // Register new customer
  registerCustomer: (userData) => {
    return api.post('/auth/register/customer', userData);
  },

  // Register employee/admin (admin only)
  registerEmployee: (userData) => {
    return api.post('/auth/register/employee', userData);
  },

  // Verify email with OTP
  verifyEmail: (email, otp) => {
    return api.post('/auth/verify-email', { email, otp });
  },

  // Login user
  login: (identifier, password) => {
    return api.post('/auth/login', { identifier, password });
  },

  // Refresh access token
  refreshToken: () => {
    return api.post('/auth/refresh');
  },

  // Logout user
  logout: () => {
    return api.post('/auth/logout');
  },

  // Get current user profile
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};

export default authService;