import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driverService';
import toast from 'react-hot-toast';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await driverService.getAll();
      setDrivers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch drivers');
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchDrivers();
  }, [fetchDrivers]);

  const addDriver = useCallback(async (driverData) => {
    try {
      const response = await driverService.create(driverData);
      toast.success('Driver added successfully!');
      if (response.data.temporaryPassword) {
        toast.success(`Temporary Password: ${response.data.temporaryPassword}`, { duration: 10000 });
      }
      await fetchDrivers();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add driver');
      return false;
    }
  }, [fetchDrivers]);

  const updateDriver = useCallback(async (id, driverData) => {
    try {
      await driverService.update(id, driverData);
      toast.success('Driver updated successfully!');
      await fetchDrivers();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update driver');
      return false;
    }
  }, [fetchDrivers]);

  const deleteDriver = useCallback(async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete driver "${name}"?`)) return false;
    try {
      await driverService.delete(id);
      toast.success('Driver deleted successfully');
      await fetchDrivers();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete driver');
      return false;
    }
  }, [fetchDrivers]);

  const updateKYC = useCallback(async (userId, verificationStatus, rejectionReason) => {
    try {
      await driverService.updateKYC({ userId, verificationStatus, rejectionReason });
      toast.success(`KYC ${verificationStatus} successfully`);
      await fetchDrivers();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update KYC');
      return false;
    }
  }, [fetchDrivers]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    loading,
    refreshing,
    error,
    refresh,
    addDriver,
    updateDriver,
    deleteDriver,
    updateKYC,
  };
};