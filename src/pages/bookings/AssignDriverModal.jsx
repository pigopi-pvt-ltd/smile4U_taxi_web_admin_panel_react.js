import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { HiOutlineUser, HiOutlineTruck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AssignDriverModal = ({ isOpen, onClose, onAssign, booking, drivers, vehicles }) => {
  const [assignData, setAssignData] = useState({
    driverId: '',
    vehicleId: ''
  });

  const handleSubmit = () => {
    if (!assignData.driverId) {
      toast.error('Please select a driver');
      return;
    }
    onAssign(booking._id, assignData.driverId, assignData.vehicleId);
    setAssignData({ driverId: '', vehicleId: '' });
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Assign Driver & Vehicle</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <HiXMark className="text-xl" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Booking Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500">Booking ID</p>
            <p className="text-sm font-semibold">{booking._id}</p>
            <p className="text-xs text-gray-500 mt-2">Customer</p>
            <p className="text-sm font-semibold">{booking.name} - {booking.contact}</p>
            <p className="text-xs text-gray-500 mt-2">Route</p>
            <p className="text-sm font-semibold">{booking.from} → {booking.destination}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <HiOutlineUser className="text-primary-yellow" /> Select Driver *
            </label>
            <select
              value={assignData.driverId}
              onChange={(e) => setAssignData({ ...assignData, driverId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
            >
              <option value="">Select a driver</option>
              {drivers.map(driver => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} - {driver.mobileNumber}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <HiOutlineTruck className="text-primary-yellow" /> Select Vehicle (Optional)
            </label>
            <select
              value={assignData.vehicleId}
              onChange={(e) => setAssignData({ ...assignData, vehicleId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.cabNumber} - {vehicle.modelName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black rounded-lg font-semibold hover:shadow-lg transition-all">
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDriverModal;