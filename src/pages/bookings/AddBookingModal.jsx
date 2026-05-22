import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { HiOutlineLocationMarker, HiOutlineUser, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AddBookingModal = ({ isOpen, onClose, onSave }) => {
  const [newBooking, setNewBooking] = useState({
    from: '',
    destination: '',
    dateTime: '',
    name: '',
    contact: '',
    price: ''
  });

  const handleSubmit = () => {
    if (!newBooking.from || !newBooking.destination || !newBooking.dateTime || !newBooking.name || !newBooking.contact) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!/^\d{10}$/.test(newBooking.contact)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    onSave(newBooking);
    setNewBooking({ from: '', destination: '', dateTime: '', name: '', contact: '', price: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
            <HiXMark className="text-xl" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location *</label>
              <div className="relative">
                <HiOutlineLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newBooking.from}
                  onChange={(e) => setNewBooking({ ...newBooking, from: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter pickup location"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destination *</label>
              <div className="relative">
                <HiOutlineLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newBooking.destination}
                  onChange={(e) => setNewBooking({ ...newBooking, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter destination"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time *</label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={newBooking.dateTime}
                  onChange={(e) => setNewBooking({ ...newBooking, dateTime: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newBooking.name}
                  onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="Enter customer name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  maxLength="10"
                  value={newBooking.contact}
                  onChange={(e) => setNewBooking({ ...newBooking, contact: e.target.value.replace(/\D/g, '') })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                value={newBooking.price}
                onChange={(e) => setNewBooking({ ...newBooking, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow dark:bg-gray-800"
                placeholder="Enter amount"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-r from-primary-yellow to-yellow-600 text-primary-black rounded-lg font-semibold hover:shadow-lg transition-all">
              Add Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;