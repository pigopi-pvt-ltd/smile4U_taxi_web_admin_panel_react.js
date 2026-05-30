import api from '../utils/httpClient';

const API_URL = '/employees';

export const employeeService = {
  // Get all employees
  getAll: () => api.get(API_URL),
  
  // Get employee by ID
  getById: (id) => api.get(`${API_URL}/${id}`),
  
  // Create new employee
  create: (data) => api.post(API_URL, data),
  
  // Update employee
  update: (id, data) => api.put(`${API_URL}/${id}`, data),
  
  // Delete employee
  delete: (id) => api.delete(`${API_URL}/${id}`),
  
  // Get employee statistics
  getStats: () => api.get(`${API_URL}/stats`),
};