import React, { useState, useEffect } from 'react';
import { HiSearch, HiPlus } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import PageHeader from '../../components/common/PageHeader';
import BookingsTable from './BookingsTable';
import AddBookingModal from './AddBookingModal';
import AssignDriverModal from './AssignDriverModal';
import toast from 'react-hot-toast';
import * as bookingService from '../../services/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        bookingService.fetchDrivers(),
        bookingService.fetchVehicles(),
      ]);
      setAvailableDrivers(driversRes.data);
      setAvailableVehicles(vehiclesRes.data);

      const [tripsRes, preplanRes] = await Promise.all([
        bookingService.fetchAllTrips(),
        bookingService.fetchAllPreplanTrips(),
      ]);

      // Transform one‑time trips
      const oneTimeBookings = tripsRes.data.map(trip => ({
        _id: trip.bookingId || trip.id,
        name: trip.customerName || trip.customerId,
        contact: trip.customerPhone || '—',
        pickup: trip.pickupLocationName,
        dropoff: trip.dropoffLocationName,
        dateTime: trip.scheduledStart,
        startDate: null,
        endDate: null,
        durationDays: null,
        price: trip.price || 0,
        status: mapTripStatus(trip.status),
        driverId: trip.assignedDriverId
          ? { _id: trip.assignedDriverId, name: trip.driverName || 'Driver' }
          : null,
        vehicleId: trip.assignedVehicleId
          ? { _id: trip.assignedVehicleId, cabNumber: trip.vehicleNumber || '—', modelName: trip.vehicleModel || '—' }
          : null,
        otp: trip.startOtpCode,
        otpExpiry: trip.scheduledStart,
        createdAt: trip.createdAt,
      }));

      // Transform long‑term preplan trips
      const longTermBookings = preplanRes.data.map(plan => ({
        _id: plan.bookingId || plan.id,
        name: plan.customerName || plan.customerId,
        contact: plan.customerPhone || '—',
        pickup: plan.pickupAddress,
        dropoff: plan.dropoffAddress,
        dateTime: null,
        startDate: plan.startDate,
        endDate: plan.endDate,
        durationDays: plan.durationDays,
        price: plan.price || 0,
        status: mapPreplanStatus(plan.status),
        driverId: plan.assignedDriverId
          ? { _id: plan.assignedDriverId, name: plan.driverName || 'Driver' }
          : null,
        vehicleId: plan.assignedVehicleId
          ? { _id: plan.assignedVehicleId, cabNumber: plan.vehicleNumber || '—', modelName: plan.vehicleModel || '—' }
          : null,
        otp: null,
        otpExpiry: null,
        createdAt: plan.createdAt,
      }));

      setBookings([...oneTimeBookings, ...longTermBookings]);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error('Could not load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const mapTripStatus = (backendStatus) => {
    const mapping = {
      admin_review: 'pending',
      assigned_pending_driver: 'assigned',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    return mapping[backendStatus] || 'pending';
  };

  const mapPreplanStatus = (backendStatus) => {
    const mapping = {
      pending_manager_or_admin_review: 'pending',
      accepted: 'confirmed',
      rejected: 'cancelled',
    };
    return mapping[backendStatus] || 'pending';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
    toast.success('Refreshing bookings');
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) throw new Error('Booking not found');

      // Determine if it's a one‑time trip (has dateTime) or preplan (has startDate)
      if (booking.dateTime) {
        let backendStatus;
        if (newStatus === 'completed') backendStatus = 'completed';
        else if (newStatus === 'cancelled') backendStatus = 'cancelled';
        else backendStatus = 'admin_review';
        await bookingService.updateTripStatus(bookingId, backendStatus);
      } else {
        await bookingService.updatePreplanStatus(
          bookingId,
          newStatus === 'cancelled' ? 'rejected' : 'accepted'
        );
      }

      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Booking ${newStatus} successfully`);
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignDriver = async (bookingId, driverId, vehicleId) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) throw new Error('Booking not found');

      if (booking.dateTime) {
        await bookingService.assignTripDriver(bookingId, driverId, vehicleId);
      } else {
        await bookingService.assignPreplanDriver(bookingId, driverId, vehicleId);
      }

      await fetchAllData();
      toast.success('Driver & vehicle assigned successfully');
    } catch (err) {
      console.error('Assignment failed:', err);
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const handleAddBooking = async (newBooking) => {
    try {
      const customerId = 'dummy-customer-id'; // Replace with actual customer selection
      const payload = {
        tripType: 'one_way',
        pickupLocationName: newBooking.from,
        dropoffLocationName: newBooking.destination,
        scheduledStart: newBooking.dateTime,
        customerId: customerId,
        price: parseFloat(newBooking.price) || 0,
      };
      const response = await bookingService.createTrip(payload);
      const newId = response.data.bookingId || response.data.id;
      const addedBooking = {
        _id: newId,
        name: newBooking.name,
        contact: newBooking.contact,
        pickup: newBooking.from,
        dropoff: newBooking.destination,
        dateTime: newBooking.dateTime,
        startDate: null,
        endDate: null,
        durationDays: null,
        price: parseFloat(newBooking.price) || 0,
        status: 'pending',
        driverId: null,
        vehicleId: null,
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [addedBooking, ...prev]);
      toast.success('Booking added successfully');
      fetchAllData();
    } catch (err) {
      console.error('Add booking failed:', err);
      toast.error('Failed to add booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact?.includes(searchTerm) ||
      booking.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropoff?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-pulse transition-colors duration-300">
        <div className="sticky top-16 h-[56px] z-30 bg-[#f8f9fa] dark:bg-slate-800/50 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="h-6 w-56 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="bg-white dark:bg-[#0A1128] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
            <div className="h-[56px] border-b border-slate-100 dark:border-slate-800 flex items-center px-6">
              <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
            </div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/30 flex items-center gap-6">
                <div className="h-4 w-12 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
                <div className="h-4 flex-1 bg-slate-100/50 dark:bg-slate-800/20 rounded"></div>
                <div className="h-4 w-24 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
                <div className="h-4 w-40 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-4 sm:-mt-8 -mx-4 sm:-mx-8 animate-in fade-in duration-500">
      <div className="bg-slate-50 dark:bg-[#0A1128] min-h-[calc(100vh-64px)] transition-colors duration-300">
        <PageHeader
          title="Bookings"
          count={filteredBookings.length}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          extraButtons={
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <HiOutlineCalendar className="text-lg md:hidden" />
              <span className="hidden md:inline">Add Booking</span>
              <span className="md:hidden">Add</span>
            </button>
          }
        />

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by customer name, contact, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-6">
          <BookingsTable
            bookings={filteredBookings}
            onUpdateStatus={handleUpdateStatus}
            onAssignDriver={(booking) => {
              setSelectedBooking(booking);
              setIsAssignModalOpen(true);
            }}
            updatingId={updatingId}
          />
        </div>

        <AddBookingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddBooking}
        />

        <AssignDriverModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedBooking(null);
          }}
          onAssign={handleAssignDriver}
          booking={selectedBooking}
          drivers={availableDrivers}
          vehicles={availableVehicles}
        />
      </div>
    </div>
  );
};

export default Bookings;