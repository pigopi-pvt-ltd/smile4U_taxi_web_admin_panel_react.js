import api from '../utils/httpClient';

const authService = {
  registerCustomer: (userData) => {
    return api.post('/auth/register/customer', userData);
  },

  registerEmployee: (userData) => {
    return api.post('/auth/register/employee', userData);
  },

  verifyEmail: (userId, otp) => {
    return api.post('/auth/verify-email', { userId, otp });
  },

  login: async (identifier, password) => {
    console.log('AuthService: Attempting login with:', { identifier });
    const response = await api.post('/auth/login', { identifier, password });
    console.log('AuthService: Login response:', response.data);
    return response;
  },

  refreshToken: () => {
    return api.post('/auth/refresh');
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};

export default authService;