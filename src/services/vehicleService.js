import httpClient from '../utils/httpClient';

const API_URL = '/vehicles';

export const vehicleService = {
  // Get all vehicles
  getAll: () => httpClient.get(API_URL),
  
  // Get vehicle by ID
  getById: (id) => httpClient.get(`${API_URL}/${id}`),
  
  // Create new vehicle
  create: (data) => httpClient.post(API_URL, data),
  
  // Update vehicle
  update: (id, data) => httpClient.put(`${API_URL}/${id}`, data),
  
  // Delete vehicle
  delete: (id) => httpClient.delete(`${API_URL}/${id}`),
  
  // Get available vehicles
  getAvailable: () => httpClient.get(`${API_URL}/available`),
  
  // Get expiring documents
  getExpiring: () => httpClient.get(`${API_URL}/expiring`),
  
  // Get vehicle statistics
  getStats: () => httpClient.get(`${API_URL}/stats`),
  
  // Assign vehicle to driver
  assignToDriver: (vehicleId, driverId) => httpClient.put(`${API_URL}/${vehicleId}/assign/${driverId}`),
};