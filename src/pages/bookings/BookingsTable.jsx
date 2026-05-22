import React from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

const BookingsTable = ({ bookings, onUpdateStatus, onAssignDriver, updatingId }) => {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return '—';
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'assigned': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Booking ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Route</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{booking._id}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.name}</p>
                    <p className="text-xs text-gray-500">{booking.contact}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{booking.from}</p>
                  <p className="text-xs text-gray-400">→ {booking.destination}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {booking.type === 'oneTime' ? (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(booking.dateTime)}</p>
                      <p className="text-xs text-gray-400">{formatTime(booking.dateTime)}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                      <p className="text-xs text-gray-400">{booking.durationDays} days</p>
                    </>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.type === 'oneTime' ? 'bg-purple-500/10 text-purple-600' : 'bg-orange-500/10 text-orange-600'
                  }`}>
                    {booking.type === 'oneTime' ? 'One Time' : 'Long Term'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {booking.driverId ? (
                    <span className="text-sm text-gray-800 dark:text-white">{booking.driverId.name}</span>
                  ) : (
                    <button
                      onClick={() => onAssignDriver(booking)}
                      className="text-xs text-primary-yellow font-semibold hover:underline"
                    >
                      + Assign
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {booking.vehicleId?.cabNumber || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{booking.price}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => onUpdateStatus(booking._id, 'confirmed')}
                        disabled={updatingId === booking._id}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Confirm"
                      >
                        <HiOutlineCheckCircle className="text-lg" />
                      </button>
                    )}
                    {booking.status === 'assigned' && (
                      <button
                        onClick={() => onUpdateStatus(booking._id, 'completed')}
                        disabled={updatingId === booking._id}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                        title="Complete"
                      >
                        <HiOutlineCheckCircle className="text-lg" />
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'assigned') && (
                      <button
                        onClick={() => onUpdateStatus(booking._id, 'cancelled')}
                        disabled={updatingId === booking._id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Cancel"
                      >
                        <HiOutlineXCircle className="text-lg" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
        <p className="text-gray-500">Showing {bookings.length} bookings</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Previous</button>
          <button className="px-3 py-1 text-sm bg-primary-yellow text-primary-black rounded-lg font-semibold">1</button>
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">2</button>
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-all">Next</button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;