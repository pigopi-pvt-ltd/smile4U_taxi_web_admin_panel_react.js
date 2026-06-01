import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import toast from 'react-hot-toast';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.getAll();
      // Safely dig through nested structures if data is enveloped in production
      const data = response?.data;
      
      let employeesArray = [];
      if (Array.isArray(data)) {
        employeesArray = data;
      } else if (data && Array.isArray(data.data)) {
        employeesArray = data.data;
      } else if (data && Array.isArray(data.employees)) {
        employeesArray = data.employees;
      }

      setEmployees(employeesArray);
    } catch (err) {
      // CRITICAL: This will keep the logs in your production environment if it redirects
      console.error('CRITICAL PRODUCTION ERROR [Employees]:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      setError(err.response?.data?.message || 'Failed to fetch employees');
      toast.error(err.response?.data?.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const refresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const addEmployee = async (employeeData) => {
    try {
      if (!employeeData.name) {
        toast.error('Employee name is required');
        throw new Error('Name is required');
      }
      const response = await employeeService.create(employeeData);
      const newEmployee = response.data;
      setEmployees(prev => [newEmployee, ...prev]);
      toast.success('Employee created successfully');
      return newEmployee;
    } catch (err) {
      console.error('Error creating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to create employee');
      throw err;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await employeeService.update(id, employeeData);
      const updatedEmployee = response.data;
      setEmployees(prev => prev.map(emp => 
        emp._id === id || emp.id === id ? { ...emp, ...updatedEmployee } : emp
      ));
      toast.success('Employee updated successfully');
      return updatedEmployee;
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to update employee');
      throw err;
    }
  };

  const deleteEmployee = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return false;
    }
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id && emp.id !== id));
      toast.success('Employee deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error(err.response?.data?.message || 'Failed to delete employee');
      return false;
    }
  };

  const getEmployeeById = async (id) => {
    try {
      const response = await employeeService.getById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching employee:', err);
      toast.error('Failed to load employee details');
      throw err;
    }
  };

  const getEmployeeStats = async () => {
    try {
      const response = await employeeService.getStats();
      return response.data;
    } catch (err) {
      console.error('Error fetching employee stats:', err);
      return { total: 0, active: 0 };
    }
  };

  return {
    employees,
    loading,
    refreshing,
    error,
    refresh,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeStats,
  };
};