import api from '../utils/httpClient';

// ----------------------------------------------------------------------
//  GET /trips/admin/all
export const fetchAllTrips = () => api.get('/trips/admin/all');

//  POST /trips/request 
export const createTrip = (data) => api.post('/trips/request', data);

// PATCH /trips/:id/assign – already exists
export const assignTripDriver = (tripId, driverId, vehicleId) =>
  api.patch(`/trips/${tripId}/assign`, { driverId, vehicleId });

//  PATCH /trips/:id/status
export const updateTripStatus = (tripId, status) =>
  api.patch(`/trips/${tripId}/status`, { status });

// ----------------------------------------------------------------------
// PREPLAN TRIPS 
// ----------------------------------------------------------------------
//  GET /preplan-trips/admin/all
export const fetchAllPreplanTrips = () => api.get('/preplan-trips/admin/all');

// POST /preplan-trips  (requires customer role – admin may need a separate endpoint)
export const createPreplanTrip = (data) => api.post('/preplan-trips', data);

//  POST /preplan-trips/:id/assign
export const assignPreplanDriver = (preplanTripId, driverId, vehicleId) =>
  api.post(`/preplan-trips/${preplanTripId}/assign`, { driverId, vehicleId });

//   PATCH /preplan-trips/:id/status
export const updatePreplanStatus = (preplanTripId, status) =>
  api.patch(`/preplan-trips/${preplanTripId}/status`, { status });

// ----------------------------------------------------------------------
// DRIVERS & VEHICLES
// ----------------------------------------------------------------------
export const fetchDrivers = () => api.get('/drivers');
export const fetchVehicles = () => api.get('/vehicles');