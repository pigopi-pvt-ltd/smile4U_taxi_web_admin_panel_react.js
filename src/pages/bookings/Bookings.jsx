import React, { useState, useEffect } from 'react';
import { HiSearch, HiPlus } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import PageHeader from '../../components/common/PageHeader';
import BookingsTable from './BookingsTable';
import AddBookingModal from './AddBookingModal';
import AssignDriverModal from './AssignDriverModal';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Mock data
  const mockBookings = [
    {
      _id: 'BK-001',
      name: 'John Doe',
      contact: '9876543210',
      from: 'Downtown',
      destination: 'Airport',
      dateTime: '2024-01-21T09:30:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 450,
      status: 'completed',
      type: 'oneTime',
      driverId: { _id: 'DRV-001', name: 'Mike Smith' },
      vehicleId: { _id: 'VEH-001', cabNumber: 'MH01AB1234', modelName: 'Toyota Camry' },
      otp: '123456',
      otpExpiry: new Date(Date.now() + 3600000).toISOString(),
      createdAt: '2024-01-20T10:00:00'
    },
    {
      _id: 'BK-002',
      name: 'Sarah Johnson',
      contact: '9876543211',
      from: 'Mall',
      destination: 'Hotel',
      dateTime: '2024-01-21T11:15:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 320,
      status: 'confirmed',
      type: 'oneTime',
      driverId: null,
      vehicleId: null,
      otp: null,
      createdAt: '2024-01-20T11:00:00'
    },
    {
      _id: 'BK-003',
      name: 'Robert Brown',
      contact: '9876543212',
      from: 'Station',
      destination: 'Business Park',
      dateTime: '2024-01-21T14:00:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 580,
      status: 'pending',
      type: 'oneTime',
      driverId: null,
      vehicleId: null,
      otp: null,
      createdAt: '2024-01-20T09:00:00'
    },
    {
      _id: 'BK-004',
      name: 'Lisa Anderson',
      contact: '9876543213',
      from: 'Airport',
      destination: 'Convention Center',
      dateTime: '2024-01-20T08:45:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 670,
      status: 'completed',
      type: 'oneTime',
      driverId: { _id: 'DRV-002', name: 'Emily Davis' },
      vehicleId: { _id: 'VEH-002', cabNumber: 'MH02CD5678', modelName: 'Honda CR-V' },
      otp: '654321',
      otpExpiry: new Date(Date.now() - 3600000).toISOString(),
      createdAt: '2024-01-19T15:00:00'
    },
    {
      _id: 'BK-005',
      name: 'Michael Lee',
      contact: '9876543214',
      from: 'Suburb',
      destination: 'City Center',
      dateTime: '2024-01-20T15:30:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 380,
      status: 'cancelled',
      type: 'oneTime',
      driverId: null,
      vehicleId: null,
      otp: null,
      createdAt: '2024-01-19T10:00:00'
    },
    {
      _id: 'BK-006',
      name: 'Emma Watson',
      contact: '9876543215',
      from: 'Hotel',
      destination: 'Airport',
      dateTime: '2024-01-19T07:00:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 520,
      status: 'completed',
      type: 'oneTime',
      driverId: { _id: 'DRV-001', name: 'Mike Smith' },
      vehicleId: { _id: 'VEH-003', cabNumber: 'MH03EF9012', modelName: 'Hyundai i20' },
      otp: '789012',
      otpExpiry: new Date(Date.now() - 7200000).toISOString(),
      createdAt: '2024-01-18T14:00:00'
    },
    {
      _id: 'BK-007',
      name: 'Chris Evans',
      contact: '9876543216',
      from: 'Downtown',
      destination: 'Stadium',
      dateTime: '2024-01-19T18:30:00',
      startDate: null,
      endDate: null,
      durationDays: null,
      price: 280,
      status: 'cancelled',
      type: 'oneTime',
      driverId: null,
      vehicleId: null,
      otp: null,
      createdAt: '2024-01-18T09:00:00'
    },
    {
      _id: 'BK-008',
      name: 'Natalie Portman',
      contact: '9876543217',
      from: 'Airport',
      destination: 'Resort',
      dateTime: null,
      startDate: '2024-01-18',
      endDate: '2024-01-25',
      durationDays: 7,
      price: 12500,
      status: 'confirmed',
      type: 'longTerm',
      driverId: { _id: 'DRV-003', name: 'David Wilson' },
      vehicleId: { _id: 'VEH-004', cabNumber: 'MH04GH3456', modelName: 'Toyota Innova' },
      otp: '345678',
      otpExpiry: new Date(Date.now() + 86400000).toISOString(),
      createdAt: '2024-01-15T12:00:00'
    }
  ];

  const availableDrivers = [
    { _id: 'DRV-001', name: 'Mike Smith', email: 'mike@example.com', mobileNumber: '9876543210' },
    { _id: 'DRV-002', name: 'Emily Davis', email: 'emily@example.com', mobileNumber: '9876543211' },
    { _id: 'DRV-003', name: 'David Wilson', email: 'david@example.com', mobileNumber: '9876543212' },
    { _id: 'DRV-004', name: 'Sarah Johnson', email: 'sarah@example.com', mobileNumber: '9876543213' }
  ];

  const availableVehicles = [
    { _id: 'VEH-001', cabNumber: 'MH01AB1234', modelName: 'Toyota Camry', isAvailable: true },
    { _id: 'VEH-002', cabNumber: 'MH02CD5678', modelName: 'Honda CR-V', isAvailable: true },
    { _id: 'VEH-003', cabNumber: 'MH03EF9012', modelName: 'Hyundai i20', isAvailable: true },
    { _id: 'VEH-004', cabNumber: 'MH04GH3456', modelName: 'Toyota Innova', isAvailable: true }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setRefreshing(false);
      toast.success('Bookings refreshed');
    }, 500);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setTimeout(() => {
      setBookings(prev => prev.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      toast.success(`Booking ${newStatus} successfully`);
      setUpdatingId(null);
    }, 500);
  };

  const handleAssignDriver = async (bookingId, driverId, vehicleId) => {
    const driver = availableDrivers.find(d => d._id === driverId);
    const vehicle = availableVehicles.find(v => v._id === vehicleId);
    
    setBookings(prev => prev.map(booking =>
      booking._id === bookingId
        ? {
            ...booking,
            driverId: driver ? { _id: driver._id, name: driver.name } : null,
            vehicleId: vehicle ? { _id: vehicle._id, cabNumber: vehicle.cabNumber, modelName: vehicle.modelName } : null,
            status: 'assigned',
            otp: Math.floor(100000 + Math.random() * 900000).toString(),
            otpExpiry: new Date(Date.now() + 3600000).toISOString()
          }
        : booking
    ));
    toast.success('Driver and vehicle assigned successfully! OTP sent to customer');
  };

  const handleAddBooking = (newBooking) => {
    const newId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    setBookings(prev => [{
      _id: newId,
      ...newBooking,
      status: 'pending',
      type: 'oneTime',
      driverId: null,
      vehicleId: null,
      createdAt: new Date().toISOString()
    }, ...prev]);
    toast.success('Booking added successfully');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact?.includes(searchTerm) ||
      booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
        
        {/* Page Header Component */}
        <PageHeader
          title="Bookings"
          count={filteredBookings.length}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          extraButtons={
            <>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="hidden md:flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="oneTime">One‑time</option>
                <option value="longTerm">Long‑term</option>
              </select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <HiOutlineCalendar className="text-lg md:hidden" />
                <span className="hidden md:inline">Add Booking</span>
                <span className="md:hidden">Add</span>
              </button>
            </>
          }
        />

        {/* Search and Filters */}
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

        {/* Bookings Table Component */}
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

        {/* Add Booking Modal */}
        <AddBookingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddBooking}
        />

        {/* Assign Driver Modal */}
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