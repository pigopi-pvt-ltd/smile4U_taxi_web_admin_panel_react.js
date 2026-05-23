import api from '../utils/httpClient';

// Your backend routes are at /admin/drivers (no /api prefix)
const API_URL = '/admin/drivers';

export const driverService = {
  // Get all drivers
  getAll: () => api.get(API_URL),
  
  // Get driver by ID
  getById: (id) => api.get(`${API_URL}/${id}`),
  
  // Create new driver
  create: (data) => api.post(API_URL, data),
  
  // Update driver
  update: (id, data) => api.put(`${API_URL}/${id}`, data),
  
  // Delete driver
  delete: (id) => api.delete(`${API_URL}/${id}`),
  
  // Update KYC status
  updateKYC: (data) => api.put('/admin/drivers/kyc/update', data),
  
  // Get available drivers
  getAvailable: () => api.get('/admin/drivers/available'),
  
  // Get driver statistics
  getStats: () => api.get('/admin/drivers/stats'),
};