import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import toast from 'react-hot-toast';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getAll();
      const data = response?.data;
      
      // Handle diverse collection data payloads sent from production environments
      let vehiclesArray = [];
      if (Array.isArray(data)) {
        vehiclesArray = data;
      } else if (data && Array.isArray(data.data)) {
        vehiclesArray = data.data;
      } else if (data && Array.isArray(data.vehicles)) {
        vehiclesArray = data.vehicles;
      }

      setVehicles(vehiclesArray);
      setError(null);
    } catch (err) {
      console.error('CRITICAL PRODUCTION INTERCEPTOR OVERRIDE LOG [Vehicles]:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
      toast.error(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = useCallback(async (vehicleData) => {
    try {
      const response = await vehicleService.create(vehicleData);
      toast.success('Vehicle added successfully!');
      await fetchVehicles();
      return response.data;
    } catch (err) {
      console.error('Error adding vehicle form payload:', err);
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
      return null;
    }
  }, [fetchVehicles]);

  const updateVehicle = useCallback(async (id, vehicleData) => {
    try {
      await vehicleService.update(id, vehicleData);
      toast.success('Vehicle updated successfully!');
      await fetchVehicles();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
      return false;
    }
  }, [fetchVehicles]);

  const deleteVehicle = useCallback(async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete vehicle "${name}"?`)) return false;
    try {
      await vehicleService.delete(id);
      toast.success('Vehicle deleted successfully');
      await fetchVehicles();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete vehicle');
      return false;
    }
  }, [fetchVehicles]);

  const assignToDriver = useCallback(async (vehicleId, driverId) => {
    try {
      await vehicleService.assignToDriver(vehicleId, driverId);
      toast.success('Vehicle assigned successfully');
      await fetchVehicles();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign vehicle');
      return false;
    }
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    refreshing,
    error,
    refresh,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignToDriver,
  };
};